import { NestFactory, PartialGraphHost, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { getLogLevels } from './loglevel';
import { WebConfig } from './config/WebConfig';
import * as path from 'path';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { getConfigKey } from '@dms/config';
import fs from 'fs';

(async function () {
    const app = await NestFactory.create(AppModule, {
        logger: getLogLevels(process.env['DMS_LOG_LEVEL'] || 'INFO'),
        snapshot: process.env.NODE_ENV !== 'PRODUCTION',
        abortOnError: process.env.NODE_ENV === 'PRODUCTION',
    });

    const generalConfigs: WebConfig = app.get(getConfigKey(WebConfig));
    app.setGlobalPrefix(path.join(generalConfigs.basePath, 'api'));
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            // transformOptions: {
            //     enableImplicitConversion: true,
            //     exposeDefaultValues: true,
            // },
        })
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.listen(generalConfigs.port, '0.0.0.0');
})().catch(() => {
    fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
    process.exit(1);
});
