provider "grafana" {
  alias         = "cloud"
  cloud_api_key = var.grafana_api_key
}

resource "grafana_cloud_stack" "forum" {
  provider = grafana.cloud

  name        = var.grafana_stack_name
  slug        = var.grafana_stack_name
  region_slug = "us"
}

resource "grafana_cloud_access_policy" "open_telemetry" {
  provider = grafana.cloud

  region       = "us"
  name         = "open-telemetry"
  display_name = "OpenTelemetry"

  scopes = ["metrics:write", "traces:write"]

  realm {
    type       = "stack"
    identifier = grafana_cloud_stack.forum.id
  }
}

resource "grafana_cloud_access_policy_token" "open_telemetry" {
  provider = grafana.cloud

  region           = "us"
  access_policy_id = grafana_cloud_access_policy.open_telemetry.policy_id
  name             = "terraform-open-telemetry-token"
  display_name     = "Terraform OpenTelemetry token"
}

output "grafana_url" {
  value       = grafana_cloud_stack.forum.url
  description = "The URL the Grafana site can be reached at."
}

output "grafana_otlp_host" {
  value       = "otlp-gateway-${var.grafana_zone}.grafana.net"
  description = "The host to send OpenTelemetry data to"
}

locals {
  grafana_otlp_auth = base64encode(
    "${grafana_cloud_stack.forum.id}:${grafana_cloud_access_policy_token.open_telemetry.token}"
  )
}

output "grafana_otlp_token" {
  value       = local.grafana_otlp_auth
  sensitive   = true
  description = "The token to use when writing OpenTelemetry metrics"
}

resource "grafana_synthetic_monitoring_installation" "forum" {
  provider              = grafana.cloud
  metrics_publisher_key = var.grafana_api_key
  stack_id              = grafana_cloud_stack.forum.id
}

provider "grafana" {
  alias           = "sm"
  sm_access_token = grafana_synthetic_monitoring_installation.forum.sm_access_token
  sm_url          = grafana_synthetic_monitoring_installation.forum.stack_sm_api_url
}

data "grafana_synthetic_monitoring_probes" "forum" {
  provider = grafana.sm
}

resource "grafana_synthetic_monitoring_check" "forum_http" {
  provider = grafana.sm
  job      = "HTTP Defaults"
  target   = "https://${var.domain}"
  probes = [
    data.grafana_synthetic_monitoring_probes.forum.probes.Atlanta,
  ]
  settings {
    http {}
  }
}
