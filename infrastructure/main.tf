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
    bucket         = "Eissa-terraform-state-ACCOUNT_ID"   # replace after bootstrap.sh
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


