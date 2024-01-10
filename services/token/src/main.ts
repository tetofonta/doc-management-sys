import { AppModule } from './app/app.module';
import { AppWebConfig } from './config/WebConfig';
import { getConfigKey } from '@dms/config';
import { build_and_start_application } from '@dms/http-base';

(async function () {
    await build_and_start_application(AppModule, getConfigKey(AppWebConfig));
})();