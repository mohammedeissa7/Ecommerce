variable "app_name"    { type = string }
variable "environment" { type = string }
variable "vpc_id"      { type = string }
variable "db_subnets"  { type = list(string) }
variable "db_sg_id"    { type = string }
variable "node_type"   { type = string }
