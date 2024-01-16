import {
    CallHandler,
    ExecutionContext, Inject,
    Injectable,
    NestInterceptor, Optional,
    ValidationPipe,
    ValidationPipeOptions,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ClassValidatorInterceptor extends ValidationPipe implements NestInterceptor {
    constructor(
        @Inject(Reflector.name) private readonly reflector: Reflector,
        @Optional() private readonly default_options: ValidationPipeOptions
    ) {
        super(default_options);
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {

        const params = context.

        return next.handle();
    }
}
