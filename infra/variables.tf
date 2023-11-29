variable "domain" {
  type        = string
  description = "The domain the site will be hosted at"
}

variable "certbot_email" {
  type        = string
  description = "The email to register certbot with for SSL certificate registration."
}

variable "aws_region" {
  type        = string
  description = "The AWS region to use"
  default     = "us-east-1"
}

variable "rds_db_name" {
  type        = string
  default     = "forum_prod"
  description = "The name of the database to use"
}

variable "rds_username" {
  type        = string
  default     = "postgres"
  description = "The username to give the database user"
}

variable "rds_password" {
  type        = string
  description = "The password to give the database user"
  sensitive   = true
}

variable "cloudflare_account_id" {
  type        = string
  description = "The Cloudflare account ID to use"
}
