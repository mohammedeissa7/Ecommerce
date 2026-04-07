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
  default = "Eissa-cf-secret-changeme"
}
