import {
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    Logger,
    PipeTransform,
    Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DMS_AUTH_FEATURES_INJECT_KEY, DMS_AUTH_REQUEST_FEATURES_METADATA_KEY } from '../constants';
import { TokenPayload } from '../proto_types/token/auth-token';

@Injectable()
export class FeatureInjectPipe implements PipeTransform {
    private readonly logger: Logger = new Logger('FeatureAuthentication');

    constructor(
        @Inject(Reflector.name) private readonly reflector: Reflector,
        @Inject(DMS_AUTH_FEATURES_INJECT_KEY) private readonly features: { [k: string]: Type }
    ) {}

    async transform(value: { wanted?: string; context: ExecutionContext; tokenData: TokenPayload }) {
        let ret_features = [];

        const features = this.reflector.get<string[]>(
            DMS_AUTH_REQUEST_FEATURES_METADATA_KEY,
            value.context.getHandler()
        );
        if (!features) {
            this.logger.warn('No feature requested');
        }

        if (value.wanted && !features?.includes(value.wanted)) {
            this.logger.warn(`The feature "${value.wanted}" has not been explicitly requested.`);
            ret_features.push(value.wanted);
        } else {
            ret_features = features;
        }

        const ret = ret_features
            .filter((e) => value.tokenData.features.some((f) => e.startsWith(f) || value.tokenData.superuser))
            // .filter((e) => value.tokenData.features.includes(e) || value.tokenData.superuser)
            .map((e) => ({ name: e, value: this.features[e] }))
            .filter((e) => !!e.value);

        if (ret.length == 0)
            throw new ForbiddenException(`User does not possess the feature ${value.wanted}`);

        if (value.wanted) return ret[0].value;
        else return ret.reduce((a, b) => Object.assign(a, { [b.name]: b.value }));
    }

    private hasFeature(features: string[], feature: string, superuser: boolean): boolean {
        if (superuser) return true;
        return features.some((e) => e.startsWith(feature));
        // return features.includes(feature);
    }
}
