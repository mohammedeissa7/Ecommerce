variable "app_name"       { type = string }
variable "environment"    { type = string }
variable "vpc_id"         { type = string }
variable "public_subnets" { type = list(string) }
variable "acm_cert_arn"   { type = string }
variable "alb_sg_id"      { type = string }

output "arn"            { value = aws_lb.main.arn }
output "dns_name"       { value = aws_lb.main.dns_name }
output "zone_id"        { value = aws_lb.main.zone_id }
output "frontend_tg_arn" { value = aws_lb_target_group.frontend.arn }
output "backend_tg_arn"  { value = aws_lb_target_group.backend.arn }
output "https_listener_arn" { value = aws_lb_listener.https.arn }
