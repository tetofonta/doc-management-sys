import { Type } from '@nestjs/common';

export class Config {
    public readonly namespace: string;
    public readonly refClass: Type;
    public readonly required: boolean;

    constructor(namespace: string, refClass: unknown, required: boolean) {
        this.namespace = namespace;
        this.refClass = refClass as Type;
        this.required = required;
    }
}

export interface Configurable{}