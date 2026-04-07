variable "app_name" { type = string }
variable "environment" { type = string }
variable "alb_dns_name" { type = string }
variable "domain_name" { type = string }
variable "acm_cert_arn" { type = string }
variable "waf_acl_arn" {
  type    = string
  default = ""
}
variable "cloudfront_secret_header" {
  type    = string
  default = "Eissa-cf-secret-change-me"
}

output "domain_name" { value = aws_cloudfront_distribution.main.domain_name }
output "distribution_id" { value = aws_cloudfront_distribution.main.id }
output "distribution_arn" { value = aws_cloudfront_distribution.main.arn }
output "hosted_zone_id" { value = aws_cloudfront_distribution.main.hosted_zone_id }
