import { Inject, Type } from '@nestjs/common';
import { getConfigKey } from './load-config.decorator';

export function InjectConfig(cls: Type): PropertyDecorator & ParameterDecorator {
    return Inject(getConfigKey(cls));
}
