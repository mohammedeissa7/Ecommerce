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

# IAM module for roles and policies

module "iam" {
  source = "./modules/iam"

  app_name       = var.app_name
  environment    = var.environment
  aws_region     = var.aws_region
  aws_account_id = data.aws_caller_identity.current.account_id

  frontend_ecr_arn = module.ecr.frontend_repository_arn
  backend_ecr_arn  = module.ecr.backend_repository_arn
}

# Application Load Balancer module

module "alb" {
  source = "./modules/alb"

  app_name    = var.app_name
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnet_ids
  acm_cert_arn   = module.acm.certificate_arn
  alb_sg_id      = module.vpc.alb_sg_id
}

# Elastic Container Service module

module "ecs" {
  source = "./modules/ecs"

  app_name    = var.app_name
  environment = var.environment
  aws_region  = var.aws_region

  vpc_id           = module.vpc.vpc_id
  private_subnets  = module.vpc.private_subnet_ids
  app_sg_id        = module.vpc.app_sg_id

  frontend_image         = "${module.ecr.frontend_repository_url}:latest"
  backend_image          = "${module.ecr.backend_repository_url}:latest"
  task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  task_role_arn          = module.iam.ecs_task_role_arn

  frontend_target_group_arn = module.alb.frontend_tg_arn
  backend_target_group_arn  = module.alb.backend_tg_arn

  frontend_cpu    = var.frontend_cpu
  frontend_memory = var.frontend_memory
  backend_cpu     = var.backend_cpu
  backend_memory  = var.backend_memory
  desired_count   = var.desired_count

  mongo_uri_secret_arn    = module.documentdb.connection_secret_arn
  redis_url_secret_arn    = module.elasticache.connection_secret_arn
  jwt_secrets_arn         = aws_secretsmanager_secret.jwt.arn
  stripe_key_arn          = aws_secretsmanager_secret.stripe.arn
  cloudinary_creds_arn    = aws_secretsmanager_secret.cloudinary.arn

  client_url = "https://${var.domain_name}"
}

# Database modules

# DocumentDB module for MongoDB-compatible database

module "documentdb" {
  source = "./modules/documentdb"

  app_name    = var.app_name
  environment = var.environment

  vpc_id       = module.vpc.vpc_id
  db_subnets   = module.vpc.db_subnet_ids
  db_sg_id     = module.vpc.db_sg_id

  instance_class     = var.documentdb_instance_class
  instance_count     = var.documentdb_instance_count
  deletion_protection = var.environment == "production"
}