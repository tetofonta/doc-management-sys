import { TelemetryConfig } from '@dms/telemetry';
import { LoadConfig } from '@dms/config';

@LoadConfig('telemetry')
export class DMSTelemetryConfig extends TelemetryConfig {
    service_name = 'dms-querier';
}
