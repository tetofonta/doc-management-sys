import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { HTTPLoggerMiddleware } from '../middlewares/log-requests.middleware';
import { WebConfig } from '../config/WebConfig';

export class WebModule implements NestModule {
    public static forRoot(config: WebConfig): DynamicModule {
        return {
            module: WebModule,
            providers: [{ provide: 'web_config_inject', useValue: config }],
        };
    }

    public static forRootAsync(config: {
        imports: any[];
        inject: string[];
        useFactory: (...args: any[]) => WebConfig;
    }): DynamicModule {
        return {
            module: WebModule,
            imports: [...config.imports],
            providers: [{ provide: 'web_config_inject', useFactory: config.useFactory, inject: config.inject }],
        };
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HTTPLoggerMiddleware).forRoutes('*');
    }
}
