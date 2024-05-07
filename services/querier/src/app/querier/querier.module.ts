import { Module } from '@nestjs/common';
import { QueryController } from './querier.controller';
import { AuthModule } from '@dms/auth/lib/auth.module';
import { ListTagsFeature } from './features/list-tags.feature';
import { ListCategoryFeature } from './features/list-cats.feature';
import { ListDocumentsFeature } from './features/list-documents.feature';
import { SearchDocumentsFeature } from './features/search-documents.feature';
import { ExpandDocumentGraphFeature } from './features/expand-document.feature';
import { DetailDocumentFeature } from './features/detail-document.feature';

@Module({
    controllers: [QueryController],
    imports: [
        AuthModule.forFeatures(
            ListTagsFeature,
            ListCategoryFeature,
            ListDocumentsFeature,
            SearchDocumentsFeature,
            ExpandDocumentGraphFeature,
            DetailDocumentFeature
        ),
    ],
})
export class QuerierModule {}
