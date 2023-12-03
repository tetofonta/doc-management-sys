import { Injectable, Module, ModuleMetadata, Type } from '@nestjs/common';

const features: Map<Type, { name: string; module: Type }> = new Map();

export function get_feature_module(cls: Type): { name: string; module: Type } {
    return features.get(cls);
}

export function Feature(name: string, metadata?: ModuleMetadata): ClassDecorator {
    return (cls) => {
        const ref = cls as unknown as Type;
        const module = class {};

        Module({
            ...(metadata || {}),
            providers: [...(metadata?.providers || []), { provide: name, useClass: ref }],
            exports: [...(metadata?.exports || []), { provide: name, useClass: ref }],
        })(module);

        features.set(ref, { name, module });
        return Injectable()(cls);
    };
}
