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

output "grafana_url" {
  value       = grafana_cloud_stack.forum.url
  description = "The URL the Grafana site can be reached at."
}
