import os
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
    OTLPSpanExporter,
)
from opentelemetry.sdk import resources
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

version = os.environ.get("VERSION", "0")

otlp_host = os.environ.get("OTLP_HOST")
otlp_url = otlp_host and f"https://{otlp_host}/otlp"
otlp_token = os.environ.get("OTLP_TOKEN")
otlp_headers = otlp_token and {"Authorization": f"Basic {otlp_token}"}

if otlp_url:

    def post_fork(server, worker):
        server.log.info("Worker spawned (pid: %s)", worker.pid)

        resource = resources.Resource.create(
            attributes={
                resources.SERVICE_NAME: "forum-backend",
                resources.SERVICE_VERSION: version,
            }
        )

        trace.set_tracer_provider(TracerProvider(resource=resource))
        span_processor = BatchSpanProcessor(
            OTLPSpanExporter(
                endpoint=f"{otlp_url}/v1/traces",
                headers=otlp_headers,
            )
        )
        trace.get_tracer_provider().add_span_processor(span_processor)
