locals {
  # Environment comes from the Terraform workspace: `terraform workspace select dev|prod`
  env = terraform.workspace
  # Resource names: "liberq" (prod) / "liberq-dev" (dev). AWS disallows dots in some of these names.
  name = local.env == "prod" ? var.project_name : "${var.project_name}-${local.env}"
  # Human-readable label shown in the AWS console: "liberq" / "liberq.dev"
  label = local.env == "prod" ? var.project_name : "${var.project_name}.${local.env}"

  site_dir = abspath(var.site_dir)
  files    = fileset(local.site_dir, "**")

  content_types = {
    html        = "text/html; charset=utf-8"
    css         = "text/css; charset=utf-8"
    js          = "application/javascript; charset=utf-8"
    json        = "application/json"
    svg         = "image/svg+xml"
    png         = "image/png"
    jpg         = "image/jpeg"
    jpeg        = "image/jpeg"
    webp        = "image/webp"
    avif        = "image/avif"
    gif         = "image/gif"
    ico         = "image/x-icon"
    mp4         = "video/mp4"
    webm        = "video/webm"
    woff        = "font/woff"
    woff2       = "font/woff2"
    txt         = "text/plain; charset=utf-8"
    xml         = "application/xml"
    pdf         = "application/pdf"
    md          = "text/markdown; charset=utf-8"
    webmanifest = "application/manifest+json"
    glb         = "model/gltf-binary"
    gltf        = "model/gltf+json"
  }

  # Hash of every built file -> drives the CloudFront invalidation.
  site_hash = sha1(join("", [for f in sort(tolist(local.files)) : filemd5("${local.site_dir}/${f}")]))
}

resource "random_id" "suffix" {
  byte_length = 4

  lifecycle {
    precondition {
      condition     = contains(["dev", "prod"], terraform.workspace)
      error_message = "Select a workspace first: terraform workspace select dev   (or prod). Use ./deploy.sh dev|prod."
    }
  }
}

# ---------------- S3 (private) ----------------
resource "aws_s3_bucket" "site" {
  bucket        = "${local.name}-${random_id.suffix.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ---------------- CloudFront ----------------
resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${local.name}-oac-${random_id.suffix.hex}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_response_headers_policy" "site" {
  name = "${local.name}-headers-${random_id.suffix.hex}"

  security_headers_config {
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "SAMEORIGIN"
      override     = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      override                   = true
    }
    xss_protection {
      protection = true
      mode_block = true
      override   = true
    }
  }

  # Keep the dev site out of Google so it never competes with production.
  dynamic "custom_headers_config" {
    for_each = local.env == "dev" ? [1] : []
    content {
      items {
        header   = "X-Robots-Tag"
        value    = "noindex, nofollow"
        override = true
      }
    }
  }
}

# Clean URLs: /privacy-policy -> /privacy-policy/index.html (the SEO plugin writes real
# HTML files there so share previews work). Unknown paths still fall back to /index.html.
resource "aws_cloudfront_function" "clean_urls" {
  name    = "${local.name}-clean-urls-${random_id.suffix.hex}"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-EOT
    function handler(event) {
      var req = event.request;
      var uri = req.uri;
      if (uri.endsWith('/')) {
        req.uri = uri + 'index.html';
      } else if (uri.split('/').pop().indexOf('.') === -1) {
        req.uri = uri + '/index.html';
      }
      return req;
    }
  EOT
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = local.label
  default_root_object = "index.html"
  price_class         = var.price_class[local.env]
  http_version        = "http2and3"

  origin {
    origin_id                = "s3-site"
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    target_origin_id           = "s3-site"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    compress                   = true
    cache_policy_id            = data.aws_cloudfront_cache_policy.optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.site.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.clean_urls.arn
    }
  }

  # Single-page app: unknown paths serve index.html
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
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

# Only this CloudFront distribution may read the bucket.
resource "aws_s3_bucket_policy" "site" {
  bucket     = aws_s3_bucket.site.id
  depends_on = [aws_s3_bucket_public_access_block.site]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontRead"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.site.arn}/*"
      Condition = {
        StringEquals = { "AWS:SourceArn" = aws_cloudfront_distribution.site.arn }
      }
    }]
  })
}

# ---------------- Upload the built site ----------------
resource "aws_s3_object" "files" {
  for_each = local.files

  bucket       = aws_s3_bucket.site.id
  key          = each.value
  source       = "${local.site_dir}/${each.value}"
  etag         = filemd5("${local.site_dir}/${each.value}")
  content_type = lookup(local.content_types, lower(element(split(".", each.value), length(split(".", each.value)) - 1)), "application/octet-stream")

  # index.html must always revalidate; hashed/static assets can cache for a long time.
  cache_control = endswith(each.value, ".html") ? "no-cache, no-store, must-revalidate" : "public, max-age=31536000, immutable"
}

# Clear the CloudFront cache whenever the site content changes.
resource "terraform_data" "invalidate" {
  triggers_replace = [local.site_hash]
  depends_on       = [aws_s3_object.files]

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.site.id} --paths '/*' --profile ${var.aws_profile} >/dev/null"
  }
}
