variable "app_name"                    { type = string }
variable "cloudfront_distribution_arn" { type = string }

output "web_acl_arn" { value = aws_wafv2_web_acl.main.arn }
output "web_acl_id"  { value = aws_wafv2_web_acl.main.id }
