output "aws_region" {
  description = "The AWS region to use"
  value       = var.aws_region
}

output "ec2_instance_ip" {
  description = "The public IP of the EC2 instance for ssh access"
  value       = aws_eip.ec2.public_ip
}

output "rds_host" {
  description = "The host where the database can be reached"
  value       = aws_db_instance.forum.address
}

output "rds_port" {
  description = "The host where the database can be reached"
  value       = aws_db_instance.forum.port
}

output "s3_bucket_name" {
  description = "The name of the S3 bucket where images are saved."
  value       = aws_s3_bucket.images.id
}

output "cloudfront_domain" {
  description = "The publically-accessible domain where images are served"
  value       = aws_cloudfront_distribution.images.domain_name
}
