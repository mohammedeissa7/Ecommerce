variable "app_name"       { type = string }
variable "environment"    { type = string }
variable "vpc_id"         { type = string }
variable "public_subnets" { type = list(string) }
variable "acm_cert_arn"   { type = string }
variable "alb_sg_id"      { type = string }
