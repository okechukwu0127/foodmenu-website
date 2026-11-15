#!/usr/bin/env bash
# Build the site and deploy it to S3 + CloudFront via Terraform.
#
#   ./deploy.sh dev      -> liberq.dev   (builds with .env.dev; .env.dev overrides .env)
#   ./deploy.sh prod     -> liberq       (builds with .env.production)
#
# Extra args are passed to terraform, e.g. ./deploy.sh dev -auto-approve
set -euo pipefail
cd "$(dirname "$0")"

ENV="${1:-}"
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "Usage: ./deploy.sh dev|prod [terraform args]" >&2
  exit 1
fi
shift

PROFILE="${AWS_PROFILE:-foodmenu-deploy-PowerUserAccess-844706634415}"

if [[ "$ENV" == "prod" ]]; then
  read -r -p "Deploy to PRODUCTION? Make sure dev has been tested. [y/N] " ok
  [[ "$ok" == "y" || "$ok" == "Y" ]] || { echo "Aborted."; exit 1; }
  MODE="production"
else
  MODE="dev"
fi

# Refresh SSO login if needed
aws sts get-caller-identity --profile "$PROFILE" >/dev/null 2>&1 || aws sso login --profile "$PROFILE"

echo "==> Building for $ENV (vite --mode $MODE)"
rm -rf dist
npx vite build --mode "$MODE"

echo "==> Terraform apply ($ENV)"
cd infra
terraform init -input=false >/dev/null
terraform workspace select -or-create "$ENV"
terraform apply -var "aws_profile=$PROFILE" "$@"

echo
echo "[$ENV] live at: $(terraform output -raw website_url)"
