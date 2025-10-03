# Lambda and DynamoDB Terraform Template

This Terraform template creates a Lambda function and DynamoDB table using a modular approach. The template is organized into separate modules for each service, making it easy to maintain and reuse.

## Architecture

- **Lambda Function**: A Python-based AWS Lambda function with IAM roles and policies
- **DynamoDB Table**: A DynamoDB table with configurable settings
- **Modules**: Separate modules for Lambda and DynamoDB for better organization

## Structure

```
terraform_code/
├── main.tf                    # Main Terraform configuration
├── variables.tf               # Root module variables
├── outputs.tf                 # Root module outputs
├── terraform.tfvars.example   # Example variables file
├── modules/
│   ├── lambda/
│   │   ├── main.tf           # Lambda resources
│   │   ├── variables.tf      # Lambda variables
│   │   ├── outputs.tf        # Lambda outputs
│   │   └── lambda_function.py # Sample Lambda code
│   └── dynamodb/
│       ├── main.tf           # DynamoDB resources
│       ├── variables.tf      # DynamoDB variables
│       └── outputs.tf        # DynamoDB outputs
```

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform installed (version >= 1.0)
3. AWS provider configured

## Usage

1. **Clone and navigate to the terraform directory:**
   ```bash
   cd terraform_code
   ```

2. **Create your variables file:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```
   Edit `terraform.tfvars` with your desired values.

3. **Initialize Terraform:**
   ```bash
   terraform init
   ```

4. **Plan the deployment:**
   ```bash
   terraform plan
   ```

5. **Apply the configuration:**
   ```bash
   terraform apply
   ```

6. **Clean up (when done):**
   ```bash
   terraform destroy
   ```

## Configuration Options

### Lambda Function
- `lambda_function_name`: Name of the Lambda function
- `lambda_runtime`: Runtime environment (default: python3.9)
- `lambda_handler`: Function handler (default: index.handler)

### DynamoDB Table
- `dynamodb_table_name`: Name of the DynamoDB table
- `dynamodb_hash_key`: Primary key for the table (default: "id")
- `dynamodb_billing_mode`: Billing mode (default: "PAY_PER_REQUEST")

### Global Settings
- `aws_region`: AWS region for deployment (default: "us-east-1")
- `tags`: Resource tags for organization and billing

## Sample Lambda Function

The template includes a sample Python Lambda function that:
- Connects to the DynamoDB table
- Supports PUT and GET operations
- Includes proper error handling
- Uses environment variables for configuration

### Testing the Lambda Function

You can test the Lambda function with these sample payloads:

**Put an item:**
```json
{
  "action": "put",
  "id": "test-id-1",
  "data": "sample data"
}
```

**Get an item:**
```json
{
  "action": "get",
  "id": "test-id-1"
}
```

## Outputs

After deployment, Terraform will output:
- Lambda function ARN and name
- DynamoDB table name and ARN
- Lambda invoke ARN for API Gateway integration

## Security Features

- IAM roles with least-privilege access
- DynamoDB encryption enabled by default
- CloudWatch logging for Lambda function
- Proper resource tagging

## Module Benefits

1. **Reusability**: Modules can be reused across different environments
2. **Maintainability**: Separated concerns make updates easier
3. **Scalability**: Easy to add more resources or modify existing ones
4. **Best Practices**: Follows Terraform and AWS best practices

## Customization

To customize the template:
1. Modify variables in `terraform.tfvars`
2. Update module configurations in `main.tf`
3. Add additional resources to modules as needed
4. Extend the Lambda function code for your use case