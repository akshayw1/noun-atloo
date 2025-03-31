const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');

const config = require('./index');

function setupTracing() {
    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.nodeEnv,
      }),
      traceExporter: new OTLPTraceExporter({
        url: `${config.otelExporterEndpoint}/v1/traces`,
      }),
      metricExporter: new OTLPMetricExporter({
        url: `${config.otelExporterEndpoint}/v1/metrics`,
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-express': { enabled: true },
          '@opentelemetry/instrumentation-http': { enabled: true },
        }),
      ],
    });
  
    // Start the SDK without chaining promises
    try {
      sdk.start();
      console.log('OpenTelemetry instrumentation initialized');
    } catch (error) {
      console.error('Error initializing OpenTelemetry', error);
    }
  
    // Gracefully shut down the SDK on process exit
    process.on('SIGTERM', () => {
      sdk.shutdown()
        .then(() => console.log('OpenTelemetry terminated'))
        .catch((error) => console.error('Error terminating OpenTelemetry', error))
        .finally(() => process.exit(0));
    });
  
    return sdk;
  }

module.exports = { setupTracing };