import { Config, Configurable } from '../config/Config';
import { Type } from '@nestjs/common';

export function getConfigKey(cls: unknown) {
    const config = (cls as ConfigurableType).configDescriptor;
    if (!config) throw new Error('Not a config class');
    return config.namespace;
}

export function LoadConfig(namespace: string, required = false) {
    return (cls: Type) => {
        return class extends cls implements Configurable {
            public static readonly configDescriptor: Config = new Config(namespace, cls, required);

            constructor() {
                super();
            }
        } as typeof cls & ConfigurableType;
    };
}

export type ConfigurableType = Type<Configurable> & { configDescriptor: Config; namespace: string };
