import { SetMetadata, Type } from '@nestjs/common';
import { DMS_AUTH_REQUEST_FEATURES_METADATA_KEY } from '../constants';
import { get_feature_module } from './feature.decorator';

export const RequireFeatures = (...features: (string | Type)[]) =>
    SetMetadata(
        DMS_AUTH_REQUEST_FEATURES_METADATA_KEY,
        features.map((e) => (typeof e == 'string' ? e : get_feature_module(e).name))
    );
