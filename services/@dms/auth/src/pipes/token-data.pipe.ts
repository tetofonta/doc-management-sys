import { Injectable, PipeTransform } from '@nestjs/common';
import { TokenPayload } from '../proto_types/token/auth-token';

@Injectable()
export class TokenDataPipe implements PipeTransform {
    constructor() {}

    async transform(value: { tokenData: TokenPayload }): Promise<TokenPayload> {
        return value.tokenData;
    }
}
