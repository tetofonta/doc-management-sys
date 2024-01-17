import { createParamDecorator, ExecutionContext, Type } from '@nestjs/common';
import { FeatureInjectPipe } from '../pipes/feature-inject.pipe';
import { DMS_FEATURE_DETAILS_METADATA_KEY } from '../constants';

const FeatureRaw = createParamDecorator((wanted?: string, ctx?: ExecutionContext) => {
    return {
        tokenData: ctx.switchToHttp().getRequest().user,
        wanted: wanted,
        context: ctx,
    };
});

export const InjectFeature = (wanted?: string | Type) =>
    FeatureRaw(
        typeof wanted == 'string' ? wanted : Reflect.getMetadata(DMS_FEATURE_DETAILS_METADATA_KEY, wanted).name,
        FeatureInjectPipe
    );
