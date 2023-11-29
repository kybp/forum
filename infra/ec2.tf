locals {
  user_data = templatefile("user_data.sh.tftpl", {
    domain = var.domain,
    email  = var.certbot_email,

    docker_daemon_config = templatefile("docker-daemon.json.tftpl", {
      aws_region = var.aws_region,
    }),
  })
}

resource "aws_subnet" "ec2" {
  vpc_id            = aws_vpc.forum.id
  cidr_block        = local.ec2_cider_block
  availability_zone = local.availability_zones[0]
}

resource "aws_route_table_association" "ec2" {
  subnet_id      = aws_subnet.ec2.id
  route_table_id = aws_route_table.forum.id
}

resource "aws_security_group" "ec2" {
  name   = "forum_ec2"
  vpc_id = aws_vpc.forum.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    description = "SSH"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    description = "HTTP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    description = "HTTPS"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    description = "Allow all outbound traffic"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Generate TLS key for SSH access to the instance and save the private
# key to the local filesystem.

resource "tls_private_key" "ec2" {
  algorithm = "ED25519"
}

resource "aws_key_pair" "ec2" {
  key_name   = "ec2-ssh-key"
  public_key = tls_private_key.ec2.public_key_openssh
}

resource "local_sensitive_file" "ec2" {
  content  = tls_private_key.ec2.private_key_openssh
  filename = "${path.module}/${aws_key_pair.ec2.key_name}"
}

# Get an IP address for the instance.

resource "aws_eip" "ec2" {
  instance = aws_instance.forum.id
  domain   = "vpc"
}

# Configure IAM profile for CloudWatch

resource "aws_iam_role" "forum" {
  name = "EC2-Role"
  path = "/"

  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Action" : "sts:AssumeRole",
          "Principal" : {
            "Service" : "ec2.amazonaws.com"
          },
          "Effect" : "Allow"
        }
      ]
    }
  )
}

resource "aws_iam_instance_profile" "forum" {
  name = "EC2-Profile"
  role = aws_iam_role.forum.name
}

resource "aws_iam_role_policy_attachment" "systems-manager" {
  role       = aws_iam_role.forum.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "cloudwatch" {
  role       = aws_iam_role.forum.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

# Provision EC2 instance to run the server on

resource "aws_instance" "forum" {
  ami                    = "ami-0fc5d935ebf8bc3bc"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.forum.name
  subnet_id              = aws_subnet.ec2.id
  key_name               = aws_key_pair.ec2.key_name
  user_data              = local.user_data
}
