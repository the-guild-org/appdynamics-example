# AppDynamics integration example

This repository is a sample Hive Gateway set up. The goal is to integrate this example with AppDynamics tool.

The approach is to rely on AppDynamics's OTEL integration, so this repo also contains a basic to use OTEL setup.

## Installation

```sh
yarn
```

## Start the subgraphs

The gateway needs to have running subgraphs to work. This command should be run once in a distinct terminal and kept in background.

```sh
yarn start:services
```

## AppDynamics env variables

To be able to connect to AppDynamics and send metrics, you need to fill the [`.env`](./.env) file with your AppDynamics secrets and configuration. All variables are required and will be used in both the Gateway code and the OTEL Collector configuration.

For the `APPD_OTEL_API_KEY`, please refer to the [AppDynamic's OTEL integration documentation](https://docs.appdynamics.com/appd/22.x/22.4/en/application-monitoring/appdynamics-for-opentelemetry/configure-the-opentelemetry-collector#id-.ConfiguretheOpenTelemetryCollectorv22.3-exporterConfigureExporters)

## OTEL

To export metrics, the gateway will need a running OTEL collector.

This repo contains a basic OTEL Collector configuration. It is configured to export metrics to the AppDynamics OTEL endpoint, and output them to the OTEL Collector standard output (to verify metrics are sent by the gateway and processed correctly).

You should edit this file to put your AppDynamics credentials and application identifiers. Please see [`otel-collector-config.yaml`](./otel-collector-config.yaml).

This will start the OTEL collector and follow the logs:

```sh
yarn start:otel
```

You can also start the Collector in the background:

```sh
yarn start:otel -d
```

You can then either see spans in the standard output of the OTEL Collector container, or by opening [`http://localhost:55679`](http://localhost:55679) in a browser.

## Start the gateway

To make sure AppDynamics is the very first package loaded into the JS runtime, we are using the programmatic API of Hive Gateway.

This means we will not use the default HTTP server provided by Hive Gateway, but use our own.

In this example, we are using the Node standard HTTP server: `node:http`

To start the gateway:

```sh
yarn start:gateway
```

## Supergraph composition

The supergraph that will be exposed by the gateway is already committed in this repo, it should not be necessary to generate it.

But if you made changes to a subgraph schema, you can re-generate it:

> NOTE: This command is using [Apollo's `rover` CLI](https://www.apollographql.com/docs/rover/getting-started)

```sh
yarn compose
```
