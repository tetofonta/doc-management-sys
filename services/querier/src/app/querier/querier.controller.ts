import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SearchQuery } from '../../types/SearchQuery';
import { JwtAuthGuard } from '@dms/auth/lib/guards/jwt.guard';
import { FeatureGuard } from '@dms/auth/lib/guards/features.guard';
import { RequireFeatures } from '@dms/auth/lib/decorators/feature-require.decorator';
import { Validate } from '@dms/http-base/lib/decorators/validate.decorator';
import { InjectFeature } from '@dms/auth/lib/decorators/feature-inject.decorator';
import { ListTagsFeature } from './features/list-tags.feature';
import { TokenData } from '@dms/auth/lib/decorators/token-data.decorator';
import { TokenPayload } from '../../proto_types/token/auth-token';
import { ListCategoryFeature } from './features/list-cats.feature';
import { ListDocumentsFeature } from './features/list-documents.feature';
import { SearchDocumentsFeature } from './features/search-documents.feature';
import { ExpandDocumentGraphFeature } from './features/expand-document.feature';
import { ExpandDocumentParams } from '../../types/ExpandDocumentParams';
import { ExpandDocumentBody } from '../../types/ExpandDocumentBody';
import { DetailDocumentFeature } from './features/detail-document.feature';

@Controller('documents')
export class QueryController {
    @Get('/tag/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(ListTagsFeature)
    @Validate()
    public async listTags(
        @Query() q: SearchQuery,
        @InjectFeature(ListTagsFeature) ts: ListTagsFeature,
        @TokenData() token: TokenPayload
    ): Promise<object> {
        return await ts.listTags(
            q,
            token.superuser ? undefined : token.user_id,
            token.superuser ? undefined : token.groups || []
        );
    }

    @Get('/category/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(ListCategoryFeature)
    @Validate()
    public async listCategories(
        @Query() q: SearchQuery,
        @InjectFeature(ListCategoryFeature) ts: ListCategoryFeature,
        @TokenData() token: TokenPayload
    ): Promise<object> {
        return await ts.listCategories(
            q,
            token.superuser ? undefined : token.user_id,
            token.superuser ? undefined : token.groups || []
        );
    }

    @Get('/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(ListDocumentsFeature)
    @Validate()
    public async listDocuments(
        @Query() q: SearchQuery,
        @InjectFeature(ListDocumentsFeature) ts: ListDocumentsFeature,
        @TokenData() token: TokenPayload
    ): Promise<object> {
        return await ts.listDocuments(
            q,
            token.superuser ? undefined : token.user_id,
            token.superuser ? undefined : token.groups || []
        );
    }

    @Get('/search')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(SearchDocumentsFeature)
    @Validate()
    public async searchDocuments(
        @Query() q: SearchQuery,
        @InjectFeature(SearchDocumentsFeature) ts: SearchDocumentsFeature,
        @TokenData() token: TokenPayload
    ): Promise<object> {
        return await ts.searchDocuments(
            q,
            token.superuser ? undefined : token.user_id,
            token.superuser ? undefined : token.groups || []
        );
    }

    @Get('/graph/expand/doc/:id/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(ExpandDocumentGraphFeature)
    @Validate()
    public async expandDocument(
        @Query() q: SearchQuery,
        @Param() p: ExpandDocumentParams,
        @InjectFeature(ExpandDocumentGraphFeature) ts: ExpandDocumentGraphFeature,
        @TokenData() token: TokenPayload
    ): Promise<object> {
        return await ts.expandDocument(
            [p.id],
            q,
            token.superuser ? undefined : token.user_id,
            token.superuser ? undefined : token.groups || []
        );
    }

    @Post('/graph/expand/doc/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(ExpandDocumentGraphFeature)
    @Validate()
    public async expandDocuments(
        @Query() q: SearchQuery,
        @Body() b: ExpandDocumentBody,
        @InjectFeature(ExpandDocumentGraphFeature) ts: ExpandDocumentGraphFeature,
        @TokenData() token: TokenPayload
    ): Promise<object> {
        return await ts.expandDocument(
            b.documents,
            q,
            token.superuser ? undefined : token.user_id,
            token.superuser ? undefined : token.groups || []
        );
    }

    @Get('/:id/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(DetailDocumentFeature)
    @Validate()
    public async getDocument(
        @Param() p: ExpandDocumentParams,
        @InjectFeature(DetailDocumentFeature) ts: DetailDocumentFeature,
        @TokenData() token: TokenPayload
    ): Promise<object> {
        return await ts.getDocument(
            p.id,
            token.superuser ? undefined : token.user_id,
            token.superuser ? undefined : token.groups || []
        );
    }
}
