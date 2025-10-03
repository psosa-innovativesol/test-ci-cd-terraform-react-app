# DynamoDB module main configuration

resource "aws_dynamodb_table" "main" {
  name           = var.table_name
  billing_mode   = var.billing_mode
  hash_key       = var.hash_key

  # If using provisioned billing mode, set read/write capacity
  dynamic "attribute" {
    for_each = [
      {
        name = var.hash_key
        type = var.hash_key_type
      }
    ]
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  # Add range key if specified
  dynamic "attribute" {
    for_each = var.range_key != null ? [
      {
        name = var.range_key
        type = var.range_key_type
      }
    ] : []
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  # Set range key if specified
  range_key = var.range_key

  # Enable point-in-time recovery
  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  # Server-side encryption
  server_side_encryption {
    enabled = var.enable_encryption
  }

  tags = var.tags
}