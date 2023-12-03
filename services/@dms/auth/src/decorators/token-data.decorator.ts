import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenDataPipe } from '../pipes/token-data.pipe';

const TokenDataRaw = createParamDecorator((ctx?: ExecutionContext) => {
    return {
        tokenData: ctx.switchToHttp().getRequest().user,
    };
});

export const TokenData = () => TokenDataRaw(undefined, TokenDataPipe);
