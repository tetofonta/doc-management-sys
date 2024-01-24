import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OpenTelemetryModuleConfig } from '../OpenTelemetryModuleConfig';
import { IsBoolean, IsDefined, IsInt, IsString, Min, Max, ValidateIf, IsOptional } from 'class-validator';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';

export class TelemetryConfig {
    @IsString()
    @IsDefined()
    public readonly service_name: string = 'dms-service';

    @IsBoolean()
    @IsDefined()
    public readonly enable_prometheus: boolean = false;

    @IsString()
    @IsDefined()
    @ValidateIf((e) => e.enable_prometheus)
    public readonly prometheus_endpoint: string = 'metrics';

    @IsInt()
    @Max(65535)
    @Min(1)
    @IsDefined()
    @ValidateIf((e) => e.enable_prometheus)
    public readonly prometheus_port: number = 9464;

    @IsString()
    @IsOptional()
    public readonly otel_url: string;

    public make(): OpenTelemetryModuleConfig {
        return {
            serviceName: this.service_name,
            metricReader: this.enable_prometheus
                ? new PrometheusExporter({
                      port: this.prometheus_port,
                      endpoint: this.prometheus_endpoint,
                  })
                : undefined,
            spanProcessor: this.otel_url
                ? new BatchSpanProcessor(new OTLPTraceExporter({ url: this.otel_url }))
                : undefined,
        };
    }
}
