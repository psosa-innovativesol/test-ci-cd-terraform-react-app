# Variables for DynamoDB module

variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
}

variable "billing_mode" {
  description = "Billing mode for the DynamoDB table (PAY_PER_REQUEST or PROVISIONED)"
  type        = string
  default     = "PAY_PER_REQUEST"
  
  validation {
    condition     = contains(["PAY_PER_REQUEST", "PROVISIONED"], var.billing_mode)
    error_message = "Billing mode must be either PAY_PER_REQUEST or PROVISIONED."
  }
}

variable "hash_key" {
  description = "Hash key (partition key) for the DynamoDB table"
  type        = string
}

variable "hash_key_type" {
  description = "Type of the hash key (S for string, N for number, B for binary)"
  type        = string
  default     = "S"
  
  validation {
    condition     = contains(["S", "N", "B"], var.hash_key_type)
    error_message = "Hash key type must be S, N, or B."
  }
}

variable "range_key" {
  description = "Range key (sort key) for the DynamoDB table (optional)"
  type        = string
  default     = null
}

variable "range_key_type" {
  description = "Type of the range key (S for string, N for number, B for binary)"
  type        = string
  default     = "S"
  
  validation {
    condition     = contains(["S", "N", "B"], var.range_key_type)
    error_message = "Range key type must be S, N, or B."
  }
}

variable "enable_point_in_time_recovery" {
  description = "Enable point-in-time recovery for the DynamoDB table"
  type        = bool
  default     = false
}

variable "enable_encryption" {
  description = "Enable server-side encryption for the DynamoDB table"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags to apply to DynamoDB resources"
  type        = map(string)
  default     = {}
}