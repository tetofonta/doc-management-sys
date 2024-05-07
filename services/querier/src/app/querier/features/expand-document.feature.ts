import { Feature } from '@dms/auth/lib/decorators/feature.decorator';
import { ConfigLoaderModule } from '@dms/config';
import { TypesenseConfig } from '../../../config/TypesenseConfig';
import { QueryUtilsModule } from '../querier.utils.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { InjectConfig } from '@dms/config/lib/decorators/inject-config.decorator';
import { QueryService } from '../querier.service';
import { ASSOCIATION_SEPARATIONS } from '../../separations';
import { BadRequestException, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SearchQuery } from '../../../types/SearchQuery';

@Feature('documents:graph:expand', {
    imports: [ConfigLoaderModule.forFeatures(TypesenseConfig), QueryUtilsModule, HttpModule],
})
export class ExpandDocumentGraphFeature {
    constructor(
        @InjectConfig(TypesenseConfig) private readonly config: TypesenseConfig,
        private readonly qs: QueryService,
        private readonly http: HttpService
    ) {}

    public async expandDocument(
        document_ids: string[],
        q: SearchQuery,
        user: string,
        groups: string[]
    ): Promise<object> {
        const search_data = this.qs.extractQueryAndFilters(q, ASSOCIATION_SEPARATIONS, user, groups);
        const query_object = {
            searches: document_ids
                .map((e) => [
                    {
                        collection: 'association',
                        q: search_data.q,
                        page: q.page,
                        per_page: q.take,
                        filter_by: this.qs.assemble(search_data.filters, 'metadata', [], {
                            __: `src:\`${e}\``,
                        }),
                        include_fields: 'src,dest,$metadata(title,owner,group,category, strategy: merge)',
                        enable_highlight_v1: false,
                    },
                    {
                        collection: 'tag',
                        q: '*',
                        page: q.page,
                        per_page: q.take,
                        filter_by: this.qs.assemble(search_data.filters, 'metadata', [], {
                            metadata: `id:\`${e}\``,
                        }),
                        include_fields: 'tag,$metadata(id, strategy: merge)',
                        enable_highlight_v1: false,
                    },
                ])
                .flat(),
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

        return raw.data.results.reduce(
            (acc, cur) => {
                cur.hits.map((h) => {
                    if (h.document.src) {
                        //type document
                        acc.documents[h.document.dest] = { ...h.document, src: undefined };
                        if (!acc.connections[h.document.src]) acc.connections[h.document.src] = [];
                        acc.connections[h.document.src].push({ dest: h.document.dest, type: 'document' });
                    } else {
                        //type tag
                        acc.tags.add(h.document.tag);
                        if (!acc.connections[h.document.id]) acc.connections[h.document.id] = [];
                        acc.connections[h.document.id].push({ dest: h.document.tag, type: 'tag' });
                    }
                });
                return acc;
            },
            { tags: new Set(), documents: {}, connections: {} }
        );
    }
}
