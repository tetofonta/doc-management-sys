import { DynamicModule, InjectionToken, OptionalFactoryDependency, Type } from '@nestjs/common';
import { AuthorizerService } from './authorizer.service';
import { AuthConfig } from './config/AuthConfig';
import { JwtModule } from '@nestjs/jwt';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { DMS_AUTH_CONFIG_INJECT_KEY, DMS_AUTH_FEATURES_INJECT_KEY } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { get_feature_module } from './decorators/feature.decorator';
import { AuthService } from './auth.service';
import * as crypto from 'crypto';

export type AuthModuleForAuthorizerAsync = {
    imports: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    inject: (InjectionToken | OptionalFactoryDependency)[];
    useFactory: (...args: any[]) => AuthConfig | Promise<AuthConfig>;
};

export class AuthModule {
    static forFeatures(...features: Type[]): DynamicModule {
        const feature_metadata = features.map((e) => get_feature_module(e)).filter((e) => !!e.module);
        const modules = feature_metadata.map((e) => e.module);
        const all_features_names = feature_metadata.map((e) => e.name);
        const all_features = {
            provide: DMS_AUTH_FEATURES_INJECT_KEY,
            inject: all_features_names,
            useFactory: (...args: Type[]) =>
                args.reduce((a, b, i) => Object.assign(a, { [all_features_names[i]]: b }), {}),
        };
        return {
            module: AuthModule,
            providers: [all_features],
            exports: [all_features],
            imports: modules,
        };
    }

    static forAuthorizer(): DynamicModule {
        return {
            module: AuthModule,
            providers: [AuthorizerService],
            exports: [AuthorizerService],
        };
    }

    static forRoot(data: AuthConfig): DynamicModule {
        data.jwt.signOptions.keyid = crypto.createHash('sha384').update(data.jwt.publicKey).digest('base64');

        return {
            module: AuthModule,
            global: true,
            providers: [{ provide: DMS_AUTH_CONFIG_INJECT_KEY, useValue: data }, JwtStrategy, AuthService],
            imports: [
                JwtModule.register({
                    global: true,
                    ...data.jwt,
                }),
                PassportModule,
            ],
            exports: [{ provide: DMS_AUTH_CONFIG_INJECT_KEY, useValue: data }, AuthService],
        };
    }

    static forRootAsync(data: AuthModuleForAuthorizerAsync): DynamicModule {
        const config_provider = {
            provide: DMS_AUTH_CONFIG_INJECT_KEY,
            inject: data.inject,
            useFactory: async (...args: any[]) => await data.useFactory(...args),
        };

        return {
            module: AuthModule,
            global: true,
            providers: [config_provider, JwtStrategy, AuthService],
            exports: [config_provider, AuthService],
            imports: [
                ...data.imports,
                JwtModule.registerAsync({
                    inject: data.inject,
                    imports: data.imports,
                    global: true,
                    useFactory: async (...args: any[]) => {
                        const opt = (await data.useFactory(...args)).jwt;
                        opt.signOptions.keyid = crypto.createHash('sha384').update(opt.publicKey).digest('base64');
                        return opt;
                    },
                }),
                PassportModule,
            ],
        };
    }
}
