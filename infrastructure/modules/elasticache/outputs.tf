output "primary_endpoint" {
  value     = aws_elasticache_cluster.main.cache_nodes[0].address
  sensitive = true
}
output "connection_secret_arn" { value = aws_secretsmanager_secret.redis.arn }
