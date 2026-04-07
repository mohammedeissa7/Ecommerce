# Redis serves two purposes in this app:
#   1. JWT refresh token store (replaces stateless tokens with revokable server-side sessions)
#   2. Featured products cache (avoids repeated MongoDB queries — Redis SET/GET)

resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.app_name}-${var.environment}-redis-subnet-group"
  subnet_ids = var.db_subnets
  tags       = { Name = "${var.app_name}-${var.environment}-redis-subnet-group" }
}

resource "aws_elasticache_parameter_group" "main" {
  family = "redis7"
  name   = "${var.app_name}-${var.environment}-redis-params"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"   # evict least-recently-used keys when memory is full
  }

  parameter {
    name  = "maxmemory"
    value = "268435456"    # 256 MB ceiling
  }
}

resource "random_password" "redis" {
  length  = 32
  special = false   # Redis auth token cannot contain special chars
}

resource "aws_secretsmanager_secret" "redis" {
  name        = "${var.app_name}/${var.environment}/redis-url"
  description = "Redis connection URL for the backend service"
}

resource "aws_secretsmanager_secret_version" "redis" {
  secret_id     = aws_secretsmanager_secret.redis.id
  secret_string = jsonencode({
    REDIS_URL = "rediss://:${random_password.redis.result}@${aws_elasticache_cluster.main.cache_nodes[0].address}:6379"
  })
}

resource "aws_elasticache_cluster" "main" {
  cluster_id           = "${var.app_name}-${var.environment}-redis"
  engine               = "redis"
  engine_version       = "7.1"
  node_type            = var.node_type
  num_cache_nodes      = 1     # single node is fine for a token store at small scale
  parameter_group_name = aws_elasticache_parameter_group.main.name
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [var.db_sg_id]
  port                 = 6379


  # Maintenance and backup windows during low-traffic hours
  maintenance_window       = "sun:05:00-sun:07:00"
  snapshot_retention_limit = 1      # 1-day snapshot for Redis AOF recovery
  snapshot_window          = "03:00-05:00"

  tags = { Name = "${var.app_name}-${var.environment}-redis" }
}
