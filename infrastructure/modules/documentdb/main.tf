# DocumentDB 
# The cluster runs entirely in DB subnets — no internet access.

resource "aws_docdb_subnet_group" "main" {
  name       = "${var.app_name}-${var.environment}-docdb-subnet-group"
  subnet_ids = var.db_subnets

  tags = { Name = "${var.app_name}-${var.environment}-docdb-subnet-group" }
}

# KMS key for encryption at rest — rotating annually is a security best practice
resource "aws_kms_key" "docdb" {
  description             = "${var.app_name}-${var.environment} DocumentDB encryption key"
  deletion_window_in_days = 14
  enable_key_rotation     = true
  tags                    = { Name = "${var.app_name}-${var.environment}-docdb-kms" }
}

resource "aws_kms_alias" "docdb" {
  name          = "alias/${var.app_name}-${var.environment}-docdb"
  target_key_id = aws_kms_key.docdb.key_id
}

# Random password — never hardcoded, stored in Secrets Manager after creation
resource "random_password" "docdb" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "docdb" {
  name        = "${var.app_name}/${var.environment}/mongo-uri"
  description = "DocumentDB connection URI for the backend service"
  kms_key_id  = aws_kms_key.docdb.arn
}

resource "aws_secretsmanager_secret_version" "docdb" {
  secret_id = aws_secretsmanager_secret.docdb.id
  secret_string = jsonencode({
    MONGO_URI = "mongodb://${var.app_name}:${random_password.docdb.result}@${aws_docdb_cluster.main.endpoint}:27017/${var.app_name}?tls=true&tlsCAFile=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
  })
}

resource "aws_docdb_cluster_parameter_group" "main" {
  family      = "docdb5.0"
  name        = "${var.app_name}-${var.environment}-docdb-params"
  description = "DocumentDB cluster parameter group"

  parameter {
    name  = "tls"
    value = "enabled"   # enforce TLS for all connections
  }
}

resource "aws_docdb_cluster" "main" {
  cluster_identifier      = "${var.app_name}-${var.environment}-docdb"
  engine                  = "docdb"
  engine_version          = "5.0.0"

  master_username         = var.app_name
  master_password         = random_password.docdb.result

  db_subnet_group_name    = aws_docdb_subnet_group.main.name
  vpc_security_group_ids  = [var.db_sg_id]

  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.main.name

  # Encryption at rest — once enabled cannot be disabled
  storage_encrypted = true
  kms_key_id        = aws_kms_key.docdb.arn

  # Automated backups — stored in S3 by AWS, 7-day retention
  backup_retention_period = 7
  preferred_backup_window = "02:00-04:00"   # low-traffic window

  # Maintenance window — patch during low-traffic period
  preferred_maintenance_window = "sun:04:00-sun:06:00"

  # deletion_protection prevents accidental `terraform destroy` in production
  deletion_protection = var.deletion_protection

  skip_final_snapshot       = !var.deletion_protection
  final_snapshot_identifier = "${var.app_name}-${var.environment}-final-snapshot"

  tags = { Name = "${var.app_name}-${var.environment}-docdb" }
}

# Cluster instances — first is primary (read/write), rest are replicas (read-only)
resource "aws_docdb_cluster_instance" "main" {
  count              = var.instance_count
  identifier         = "${var.app_name}-${var.environment}-docdb-${count.index}"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.instance_class

  # Spread instances across AZs for high availability
  preferred_maintenance_window = "sun:04:00-sun:06:00"
  auto_minor_version_upgrade   = true

  tags = { Name = "${var.app_name}-${var.environment}-docdb-${count.index}" }
}
