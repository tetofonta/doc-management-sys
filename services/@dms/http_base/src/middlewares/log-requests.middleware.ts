import { Injectable, NestMiddleware, Logger, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WebConfig } from '../config/WebConfig';

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');
    private request_id: number = 0;

    constructor(@Inject('web_config_inject') private readonly config: WebConfig) {}

    use(request: Request, response: Response, next: NextFunction): void {
        if (!this.config.log_requests) return;

        const { ip, method, url, headers, body } = request;
        const userAgent = request.get('user-agent') || '<no user-agent>';
        const req_id = this.request_id;
        const time = Date.now();

        this.logger.log(`Incoming request:  ${req_id} ${method} ${decodeURIComponent(url)} - ${userAgent} ${ip}`);
        if (this.config.debug_requests) {
            this.logger.debug(`BODY: ${JSON.stringify(body || {})}`);
            this.logger.debug(`HEADERS: ${JSON.stringify(headers || {})}`);
        }

        response.on('close', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            const took = Date.now() - time;
            this.logger.log(`Response finished: ${req_id} status ${statusCode} Length ${contentLength} took ${took}ms`);
        });

        this.request_id += 1;
        next();
    }
}
