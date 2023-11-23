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
