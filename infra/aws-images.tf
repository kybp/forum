resource "aws_s3_bucket" "images" {}

# We need to provide a root object for other requests to be allowed.
resource "aws_s3_object" "index" {
  bucket  = aws_s3_bucket.images.id
  key     = "index.html"
  content = "<!DOCTYPE html>"
}

resource "aws_s3_bucket_ownership_controls" "images" {
  bucket = aws_s3_bucket.images.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "images" {
  depends_on = [aws_s3_bucket_ownership_controls.images]

  bucket = aws_s3_bucket.images.id
  acl    = "private"
}

resource "aws_s3_bucket_policy" "images" {
  bucket = aws_s3_bucket.images.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "s3:GetObject"
        Effect   = "Allow"
        Resource = "${aws_s3_bucket.images.arn}/*"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.images.iam_arn
        }
      }
    ]
  })
}

resource "aws_cloudfront_origin_access_identity" "images" {
  comment = "CloudFront Origin Access Identity"
}

resource "aws_cloudfront_distribution" "images" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = aws_s3_object.index.key

  origin {
    domain_name = aws_s3_bucket.images.bucket_regional_domain_name
    origin_id   = "s3-images-origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.images.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-images-origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
