terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.26"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  profile = "default"
}

locals {
  rds_port           = 5432
  ec2_cider_block    = "10.0.1.0/24"
  rds_cider_blocks   = ["10.0.2.0/24", "10.0.3.0/24"]
  availability_zones = ["us-east-1a", "us-east-1b"]
}

resource "aws_vpc" "forum" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_internet_gateway" "forum" {
  vpc_id = aws_vpc.forum.id
}

resource "aws_route_table" "forum" {
  vpc_id = aws_vpc.forum.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.forum.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.forum.id
  }
}

resource "cloudflare_zone" "forum" {
  account_id = var.cloudflare_account_id
  zone       = var.domain
}

resource "cloudflare_record" "forum" {
  zone_id = cloudflare_zone.forum.id
  name    = var.domain
  type    = "A"
  proxied = true
  value   = aws_eip.ec2.public_ip
}
