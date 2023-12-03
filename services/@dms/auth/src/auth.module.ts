import { DynamicModule, InjectionToken, Module, OptionalFactoryDependency, Type } from '@nestjs/common';
import { AuthorizerService } from './authorizer.service';
import { AuthConfig } from './config/AuthConfig';
import { JwtModule } from '@nestjs/jwt';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

export type AuthModuleForAuthorizerAsync = {
    imports: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    inject: (InjectionToken | OptionalFactoryDependency)[];
    useFactory: (...args: any[]) => AuthConfig | Promise<AuthConfig>;
};

@Module({})
export class AuthModule {
    // static forFeatures(...features: Type<AppFeature>[]): DynamicModule {
    //     return {
    //         module: AuthModule,
    //         providers: [
    //             JwtStrategy,
    //             AuthService,
    //             {
    //                 provide: "FEATURES",
    //                 inject: features,
    //                 useFactory: (...args) => args.reduce((o: any, f: AppFeature) => Object.assign(o, {[f.feature_name]: f}), {})
    //             }
    //         ],
    //         imports: [
    //             PassportModule,
    //             ConfigModule.forFeature(authConfig),
    //             TypeOrmModule.forFeature([UserEntity]),
    //             ...features.map((e: any) => e.import_module)
    //         ],
    //         exports: [AuthService]
    //     }
    // }

    static forAuthorizer(config: AuthConfig): DynamicModule {
        return {
            module: AuthModule,
            providers: [AuthorizerService, { provide: 'configs', useValue: config }],
            exports: [AuthorizerService],
            imports: [JwtModule.register(config.jwt)],
        };
    }

    static forAuthorizerAsync(data: AuthModuleForAuthorizerAsync): DynamicModule {
        return {
            module: AuthModule,
            imports: [
                ...data.imports,
                JwtModule.registerAsync({
                    imports: data.imports,
                    inject: data.inject,
                    useFactory: async (...args: any[]) => (await data.useFactory(...args)).jwt,
                }),
            ],
            providers: [AuthorizerService, { provide: 'configs', useFactory: data.useFactory, inject: data.inject }],
            exports: [AuthorizerService],
        };
    }
}
