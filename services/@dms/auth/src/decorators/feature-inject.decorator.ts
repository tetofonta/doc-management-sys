import { createParamDecorator, ExecutionContext, Type } from '@nestjs/common';
import { FeatureInjectPipe } from '../pipes/feature-inject.pipe';
import { get_feature_module } from './feature.decorator';

const FeatureRaw = createParamDecorator((wanted?: string, ctx?: ExecutionContext) => {
    return {
        tokenData: ctx.switchToHttp().getRequest().user,
        wanted: wanted,
        context: ctx,
    };
});

export const InjectFeature = (wanted?: string | Type) =>
    FeatureRaw(typeof wanted == 'string' ? wanted : get_feature_module(wanted).name, FeatureInjectPipe);
