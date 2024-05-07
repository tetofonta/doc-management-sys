import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { ConfigLoaderModule } from '@dms/config';
import { TypesenseConfig } from '../../../config/TypesenseConfig';
import { QueryUtilsModule } from '../querier.utils.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { InjectConfig } from '@dms/config/lib/decorators/inject-config.decorator';
import { QueryService } from '../querier.service';
import { METADATA_SEPARATIONS } from '../../separations';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Feature('documents:detail', {
    imports: [ConfigLoaderModule.forFeatures(TypesenseConfig), QueryUtilsModule, HttpModule],
})
export class DetailDocumentFeature {
    constructor(
        @InjectConfig(TypesenseConfig) private readonly config: TypesenseConfig,
        private readonly qs: QueryService,
        private readonly http: HttpService
    ) {}

    public async getDocument(id: string, user: string, groups: string[]): Promise<object> {
        const search_object = this.qs.extractQueryAndFilters(
            {
                q: '',
                take: 1,
                offset: 0,
                page: 1,
            },
            METADATA_SEPARATIONS,
            user,
            groups
        );
        const query_object = {
            searches: [
                {
                    collection: this.config.metadata_collection,
                    page: 1,
                    per_page: 1,
                    q: '*',
                    filter_by: this.qs.assemble(search_object.filters, undefined, ['tag'], {
                        __: `id:\`${id}\``,
                    }),
                    exclude_fields: 'embedding',
                    include_fields: '*,$tag(tag, strategy: nest_array)',
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

        console.log(raw.data.results);
        if (raw.data?.results[0].found === 0) {
            throw new NotFoundException();
        }

        return raw.data?.results[0].hits[0].document;
    }
}
