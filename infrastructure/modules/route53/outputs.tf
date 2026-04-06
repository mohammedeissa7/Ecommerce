# modules/route53/variables.tf
variable "app_name"          { type = string }
variable "domain_name"       { type = string }
variable "cloudfront_domain" { type = string }
variable "alb_dns_name"      { type = string }
variable "alb_zone_id"       { type = string }

output "zone_id"          { value = aws_route53_zone.main.zone_id }
output "name_servers"     { value = aws_route53_zone.main.name_servers }
output "health_check_id"  { value = aws_route53_health_check.api.id }
