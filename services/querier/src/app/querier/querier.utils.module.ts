import { Module } from '@nestjs/common';
import { QueryService } from './querier.service';

@Module({
    providers: [QueryService],
    exports: [QueryService],
})
export class QueryUtilsModule {}
