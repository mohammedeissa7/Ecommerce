variable "app_name" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "db_subnets" { type = list(string) }
variable "db_sg_id" { type = string }
variable "instance_class" { type = string }
variable "instance_count" { type = number }
variable "deletion_protection" {
  type    = bool
  default = false
}

output "cluster_endpoint" {
  value     = aws_docdb_cluster.main.endpoint
  sensitive = true
}
output "reader_endpoint" {
  value     = aws_docdb_cluster.main.reader_endpoint
  sensitive = true
}
output "connection_secret_arn" { value = aws_secretsmanager_secret.docdb.arn }
