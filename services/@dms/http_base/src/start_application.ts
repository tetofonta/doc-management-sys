import { NestFactory, PartialGraphHost, Reflector } from '@nestjs/core';
import * as path from 'path';
import { ClassSerializerInterceptor, INestApplication, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { getLogLevels } from './loglevel';
import { WebConfig } from './config/WebConfig';

export async function configure_application(
    module: any,
    config_key: string,
    env_log_level_name = 'DMS_LOG_LEVEL',
    log_level_default = 'INFO'
): Promise<[INestApplication, WebConfig]> {
    const app = await NestFactory.create(module, {
        logger: getLogLevels(process.env[env_log_level_name] || log_level_default),
        snapshot: process.env.NODE_ENV !== 'PRODUCTION',
        abortOnError: process.env.NODE_ENV === 'PRODUCTION',
    });

    const generalConfigs: WebConfig = app.get(config_key);
    app.setGlobalPrefix(path.join(generalConfigs.base_path, 'api'));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    return [app, generalConfigs];
}

export async function start_application<T>(app: INestApplication<T>, generalConfigs: WebConfig) {
    try {
        Logger.log(`Starting webserver at bound to ${generalConfigs.bind_address}:${generalConfigs.port}`);
        await app.listen(generalConfigs.port, generalConfigs.bind_address);
    } catch {
        fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
        process.exit(1);
    }
}

export async function build_and_start_application(
    module: any,
    config: string,
    env_log_level_name = 'DMS_LOG_LEVEL',
    log_level_default = 'INFO'
) {
    const [app, conf] = await configure_application(module, config, env_log_level_name, log_level_default);
    await start_application(app, conf);
}
