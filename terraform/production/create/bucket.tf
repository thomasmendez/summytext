resource "aws_s3_bucket" "bucketprd" {
  bucket = var.aws_bucket_name
  tags = {
    Environment = var.env
  }
}

resource "aws_s3_bucket_acl" "bucketprd" {
  bucket = var.aws_bucket_name
  acl    = "public-read"
}

resource "aws_s3_bucket_lifecycle_configuration" "bucketprd" {
  bucket = var.aws_bucket_name
  rule {
    id     = "cleanup"
    prefix = "cleanup/"
    status = "Enabled"
    expiration {
      days = 1
    }
  }
}

resource "aws_s3_bucket_policy" "bucketprd" {
  bucket = var.aws_bucket_name
  policy = <<EOF
{
  "Id": "MakePublic",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.aws_bucket_name}/*",
      "Principal": "*"
    }
  ]
}
EOF
}