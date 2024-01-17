import { Injectable, Module, ModuleMetadata, Type } from '@nestjs/common';
import { DMS_FEATURE_DETAILS_METADATA_KEY } from '../constants';

export function Feature(name: string, metadata?: ModuleMetadata): ClassDecorator {
    return (cls) => {
        const ref = cls as unknown as Type;
        const module = class {};

        Module({
            ...(metadata || {}),
            providers: [...(metadata?.providers || []), { provide: name, useClass: ref }],
            exports: [...(metadata?.exports || []), { provide: name, useClass: ref }],
        })(module);

        Reflect.defineMetadata(DMS_FEATURE_DETAILS_METADATA_KEY, { name, module }, cls);
        return Injectable()(cls);
    };
}
