import { LoadConfig } from '@dms/config';
import { WebConfig } from '@dms/http-base';

@LoadConfig('web')
export class AppWebConfig extends WebConfig {}
