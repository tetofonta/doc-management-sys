import { SetMetadata, Type } from '@nestjs/common';
import { DMS_AUTH_REQUEST_FEATURES_METADATA_KEY, DMS_FEATURE_DETAILS_METADATA_KEY } from '../constants';

export const RequireFeatures = (...features: (string | Type)[]) =>
    SetMetadata(
        DMS_AUTH_REQUEST_FEATURES_METADATA_KEY,
        features.map((e) => (typeof e == 'string' ? e : Reflect.getMetadata(DMS_FEATURE_DETAILS_METADATA_KEY, e).name))
    );
