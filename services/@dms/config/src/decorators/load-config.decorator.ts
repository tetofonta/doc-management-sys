import { Config } from '../config/Config';
import { Type } from '@nestjs/common';
import { DMS_CONFIG_METADATA_KEY } from '../constants';

export function getConfigKey(cls: unknown) {
    const config = Reflect.getMetadata(DMS_CONFIG_METADATA_KEY, cls);
    if (!config || !config.namespace) throw new Error('Not a config class');
    return config.namespace;
}

export function LoadConfig(namespace: string, required = false) {
    return (cls: Type) => {
        Reflect.defineMetadata(DMS_CONFIG_METADATA_KEY, new Config(namespace, cls, required), cls);
        return cls;
    };
}
