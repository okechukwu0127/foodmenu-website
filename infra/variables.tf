variable "aws_region" {
  description = "Region for the S3 bucket."
  type        = string
  default     = "ap-south-1"
}

variable "aws_profile" {
  description = "AWS CLI profile to deploy with."
  type        = string
  default     = "foodmenu-deploy-PowerUserAccess-844706634415"
}

variable "project_name" {
  description = "Base name for AWS resources. Prod uses it as-is; dev is suffixed (\"liberq-dev\", console label \"liberq.dev\")."
  type        = string
  default     = "liberq"
}

variable "site_dir" {
  description = "Path to the built site (vite output)."
  type        = string
  default     = "../dist"
}

variable "price_class" {
  description = "CloudFront price class per environment (PriceClass_100 = NA/EU only, PriceClass_200 adds Asia incl. India, PriceClass_All = global)."
  type        = map(string)
  default = {
    dev  = "PriceClass_100"
    prod = "PriceClass_200"
  }
}
