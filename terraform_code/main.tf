# Main Terraform configuration
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# Lambda module
module "lambda" {
  source = "./modules/lambda"
  
  function_name = var.lambda_function_name
  runtime       = var.lambda_runtime
  handler       = var.lambda_handler
  
  # Pass DynamoDB table name to Lambda
  dynamodb_table_name = module.dynamodb.table_name
  
  tags = var.tags
}

# DynamoDB module sdafasf
module "dynamodb" {
  source = "./modules/dynamodb"
  
  table_name     = var.dynamodb_table_name
  hash_key       = var.dynamodb_hash_key
  billing_mode   = var.dynamodb_billing_mode
  
  tags = var.tags
}