# backend configuration and provider setup
terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }

  backend "s3" {
    bucket         = var.terraform_state_bucket  
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "Eissa-terraform-locks"
    encrypt        = true
  }
}
# AWS provider for main region
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.app_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Network  module

# VPC and subnets

module "vpc" {
  source = "./modules/vpc"

  app_name    = var.app_name
  environment = var.environment
  aws_region  = var.aws_region

  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  db_subnet_cidrs      = var.db_subnet_cidrs
  enable_nat_gateway   = var.enable_nat_gateway
  single_nat_gateway   = var.single_nat_gateway   # true = one NAT (cheaper), false = one per AZ (HA)
}

# TLS Certificate Management using ACM module

module "acm" {
  source = "./modules/acm"

  providers = { aws = aws.us_east_1 }  

  app_name    = var.app_name
  domain_name = var.domain_name
  zone_id     = module.route53.zone_id
}

# Route 53 DNS module

module "route53" {
  source = "./modules/route53"

  app_name          = var.app_name
  domain_name       = var.domain_name
  cloudfront_domain = module.cloudfront.domain_name
  alb_dns_name      = module.alb.dns_name
  alb_zone_id       = module.alb.zone_id
}

# Compute module 

# Elastic Container Registry module

module "ecr" {
  source = "./modules/ecr"

  app_name    = var.app_name
  environment = var.environment
}

