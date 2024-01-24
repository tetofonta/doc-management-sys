import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TokenDataPipe implements PipeTransform {
    constructor() {}

    async transform(value: { tokenData: any }): Promise<any> {
        return value.tokenData;
    }
}
