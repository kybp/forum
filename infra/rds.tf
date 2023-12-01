resource "aws_subnet" "rds" {
  vpc_id            = aws_vpc.forum.id
  cidr_block        = local.rds_cider_blocks[0]
  availability_zone = local.availability_zones[0]
}

# We need a second subnet because a subnet group needs to have more
# than one, even though this is for a single-AZ DB.
resource "aws_subnet" "unused_rds" {
  vpc_id            = aws_vpc.forum.id
  cidr_block        = local.rds_cider_blocks[1]
  availability_zone = local.availability_zones[1]
}

resource "aws_db_subnet_group" "rds" {
  name       = "forum_rds_subnet_group"
  subnet_ids = [aws_subnet.rds.id, aws_subnet.unused_rds.id]
}

resource "aws_security_group" "rds" {
  name   = "forum_rds"
  vpc_id = aws_vpc.forum.id

  ingress {
    from_port   = local.rds_port
    to_port     = local.rds_port
    protocol    = "tcp"
    description = "Allow database connections"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    description = "Allow all outbound traffic"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "forum_rds"
  }
}

resource "aws_db_instance" "forum" {
  allocated_storage               = 5
  engine                          = "postgres"
  engine_version                  = "15.5"
  instance_class                  = "db.t3.micro"
  skip_final_snapshot             = true
  db_name                         = var.rds_db_name
  username                        = var.rds_username
  password                        = var.rds_password
  backup_retention_period         = 7
  backup_window                   = "03:00-04:00"
  maintenance_window              = "sun:05:00-sun:06:00"
  performance_insights_enabled    = true
  vpc_security_group_ids          = [aws_security_group.rds.id]
  db_subnet_group_name            = aws_db_subnet_group.rds.name
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
}
