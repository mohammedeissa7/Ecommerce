variable "app_name"    { type = string }
variable "domain_name" { type = string }
variable "zone_id"     { type = string }

output "certificate_arn" {
  description = "Validated ACM cert ARN — pass to ALB listener and CloudFront"
  value       = aws_acm_certificate_validation.main.certificate_arn
}
