require("dotenv/config");
require("appdynamics").profile({
  controllerHostName: process.env.APPD_CONTROLLER_ID + ".saas.appdynamics.com",
  controllerPort: 443,

  // If SSL, be sure to enable the next line
  controllerSslEnabled: true,
  accountName: process.env.APPD_CONTROLLER_ID,
  accountAccessKey: process.env.APPD_CONTROLLER_ACCESS_KEY,
  applicationName: process.env.APPD_APPLICATION_NAME,
  tierName: process.env.APPD_APPLICATION_TIER,
  nodeName: "process", // The controller will automatically append the node name with a unique number
  enableGraphQL: true, //
  openTelemetry: {
    enabled: true, // openTelemetry is enabled or disabled
    debug: true,
    collector: {
      url: "http://localhost:4318/v1/traces",
    },
  },
});

const { createServer } = require("http");
const {
  createGatewayRuntime,
  DefaultLogger,
} = require("@graphql-hive/gateway-runtime");
const {
  createStdoutExporter,
  useOpenTelemetry,
} = require("@graphql-hive/gateway");
const { trace } = require("@opentelemetry/api");
const { readFileSync } = require("fs");

const runtime = createGatewayRuntime({
  supergraph: readFileSync("./supergraph.graphql").toString("utf-8"),
  logging: new DefaultLogger("Gateway", "debug"),
  plugins: (ctx) => [
    useOpenTelemetry({
      ...ctx,
      exporters: [createStdoutExporter()],
      serviceName: "test-1",
      tracer: trace.getTracerProvider().getTracer("appdynamics-tracer"),
      inheritContext: true, // Optional, whether to inherit the context from the incoming request
      propagateContext: true, // Optional, whether to propagate the context to the outgoing requests
      spans: {
        http: true, // Whether to track the HTTP request/response
        graphqlParse: true, // Whether to track the GraphQL parse phase
        graphqlValidate: true, // Whether to track the GraphQL validate phase
        graphqlExecute: true, // Whether to track the GraphQL execute phase
        subgraphExecute: true, // Whether to track the subgraph execution phase
        upstreamFetch: true, // Whether to track the upstream HTTP requests
      },
    }),
  ],
});

const server = createServer(runtime);
server.listen(4000, () => {
  console.log(`Server is running on http://localhost:4000`);
});
