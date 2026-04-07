output "vpc_id" {
  description = "VPC ID — referenced by Ansible and debugging tools"
  value       = module.vpc.vpc_id
}

output "alb_dns_name" {
  description = "ALB DNS name — used to test the app before DNS propagation"
  value       = module.alb.dns_name
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain — primary entry point"
  value       = module.cloudfront.domain_name
}

output "app_url" {
  description = "Application URL"
  value       = "https://${var.domain_name}"
}

output "frontend_ecr_url" {
  description = "ECR URL for pushing the frontend Docker image"
  value       = module.ecr.frontend_repository_url
}

output "backend_ecr_url" {
  description = "ECR URL for pushing the backend Docker image"
  value       = module.ecr.backend_repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name — used by GitHub Actions ecs update-service"
  value       = module.ecs.cluster_name
}

output "frontend_service_name" {
  description = "ECS frontend service name"
  value       = module.ecs.frontend_service_name
}

output "backend_service_name" {
  description = "ECS backend service name"
  value       = module.ecs.backend_service_name
}

output "documentdb_endpoint" {
  description = "DocumentDB cluster endpoint"
  value       = module.documentdb.cluster_endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "ElastiCache Redis primary endpoint"
  value       = module.elasticache.primary_endpoint
  sensitive   = true
}

output "github_actions_role_arn" {
  description = "IAM Role ARN for GitHub Actions OIDC — paste into GitHub repo settings"
  value       = module.iam.github_actions_role_arn
}
