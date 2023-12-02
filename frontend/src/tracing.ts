import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web'
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'

const otlpUrl = '/otlp'
const shouldTrace = !!import.meta.env.OTLP_HOST

if (shouldTrace) {
  const traceExporter = new OTLPTraceExporter({
    url: `${otlpUrl}/v1/traces`,
  })

  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'forum-frontend',
    [SemanticResourceAttributes.SERVICE_VERSION]: import.meta.env.VERSION,
  })

  const provider = new WebTracerProvider({ resource })

  provider.addSpanProcessor(new BatchSpanProcessor(traceExporter))

  provider.register({
    // Configure the propagator to enable context propagation between
    // services using the W3C Trace Headers
    propagator: new CompositePropagator({
      propagators: [
        new W3CBaggagePropagator(),
        new W3CTraceContextPropagator(),
      ],
    }),
  })
}

const startOtelInstrumentation = () => {
  if (!shouldTrace) return

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        '@opentelemetry/instrumentation-xml-http-request': {
          enabled: true,
          clearTimingResources: true,
          propagateTraceHeaderCorsUrls: [
            `https://${import.meta.env.DOMAIN}`,
            'http://localhost:3000',
            'http://frontend:3000',
          ],
        },
      }),
    ],
  })
}

export { startOtelInstrumentation }
