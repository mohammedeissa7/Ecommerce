# Terraform variables for Eissa Ecommerce infrastructure
variable "app_name" {
  description = "Application name, used as a prefix on all resource names"
  type        = string
  default     = "Eissa"
}

variable "environment" {
  description = "Deployment environment: staging or production"
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Must be 'staging' or 'production'."
  }
}

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Root domain"
  type        = string
}

variable "terraform_state_bucket" {
  description = "S3 bucket for Terraform state storage"
  type        = string
}

# Network variables

variable "vpc_cidr" {
  description = "VPC IPv4 CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR for each public subnet (one per AZ)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR for each private subnet — ECS tasks live here"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]
}

variable "db_subnet_cidrs" {
  description = "CIDR for isolated DB subnets — DocumentDB and Redis"
  type        = list(string)
  default     = ["10.0.20.0/24", "10.0.21.0/24", "10.0.22.0/24"]
}

variable "enable_nat_gateway" {
  description = "Create NAT Gateways so private tasks can reach internet (ECR, Secrets)"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "true = one NAT (saves ~$32/mo), false = one per AZ (HA)"
  type        = bool
  default     = true   # cost-optimised default; set false for production HA
}

# Compute variables:

variable "frontend_cpu" {
  description = "Fargate vCPU units for the frontend task (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Fargate memory MiB for the frontend task"
  type        = number
  default     = 512
}

variable "backend_cpu" {
  description = "Fargate vCPU units for the backend task"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Fargate memory MiB for the backend task"
  type        = number
  default     = 1024
}

variable "desired_count" {
  description = "Number of ECS tasks per service (min 2 for multi-AZ HA)"
  type        = number
  default     = 2
}

# Database variables:

variable "documentdb_instance_class" {
  description = "DocumentDB instance class"
  type        = string
  default     = "db.t3.medium"   # ~$60/mo per instance
}

variable "documentdb_instance_count" {
  description = "Number of DocumentDB instances (1 primary + N replicas)"
  type        = number
  default     = 2   # 1 primary + 1 replica for read HA
}

variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"   # ~$13/mo, sufficient for token store
}
