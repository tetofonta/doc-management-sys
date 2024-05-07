import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { ConfigLoaderModule } from '@dms/config';
import { TypesenseConfig } from '../../../config/TypesenseConfig';
import { QueryUtilsModule } from '../querier.utils.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { InjectConfig } from '@dms/config/lib/decorators/inject-config.decorator';
import { QueryService } from '../querier.service';
import { SearchQuery } from '../../../types/SearchQuery';
import { METADATA_SEPARATIONS } from '../../separations';
import { BadRequestException, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Feature('documents:list:category', {
    imports: [ConfigLoaderModule.forFeatures(TypesenseConfig), QueryUtilsModule, HttpModule],
})
export class ListCategoryFeature {
    constructor(
        @InjectConfig(TypesenseConfig) private readonly config: TypesenseConfig,
        private readonly qs: QueryService,
        private readonly http: HttpService
    ) {}

    public async listCategories(q: SearchQuery, user: string, groups: string[]): Promise<object> {
        const search_data = this.qs.extractQueryAndFilters(q, METADATA_SEPARATIONS, user, groups);
        const query_object = {
            searches: [
                {
                    collection: this.config.metadata_collection,
                    page: q.page,
                    per_page: q.take,
                    q: search_data.q,
                    filter_by: this.qs.assemble(search_data.filters),
                    query_by: 'category,embedding',
                    infix: 'always,off',
                    group_by: 'category',
                    include_fields: '-',
                    group_limit: 1,
                    enable_highlight_v1: false,
                },
            ],
        };

        Logger.log(JSON.stringify(query_object));
        const raw = await lastValueFrom(
            this.http.post(this.config.url + '/multi_search', query_object, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-TYPESENSE-API-KEY': this.config.api_key,
                },
            })
        );

        if (raw.status !== 200) {
            throw new BadRequestException(`Typesense returned ${raw.status}`);
        }
        if (raw.data?.results?.length === 0) {
            throw new BadRequestException(`Typesense did not return anything`);
        }

        return {
            count: raw.data.results[0].found,
            result: raw.data.results[0].grouped_hits?.map((e) => ({
                id: e.group_key[0],
                count: e.found,
            })),
        };
    }
}
