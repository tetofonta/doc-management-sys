import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DMS_AUTH_REQUEST_FEATURES_METADATA_KEY } from '../constants';

@Injectable()
export class FeatureGuard implements CanActivate {
    constructor(@Inject(Reflector.name) private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const features = this.reflector.get<string[]>(DMS_AUTH_REQUEST_FEATURES_METADATA_KEY, context.getHandler());
        if (!features) {
            Logger.warn('No feature requested.', 'FeatureGuard');
            return true;
        }
        const r = context.switchToHttp().getRequest();
        return r.user.superuser || features.every((f) => r.user.features.some((e: string) => f.startsWith(e)));
    }
}
