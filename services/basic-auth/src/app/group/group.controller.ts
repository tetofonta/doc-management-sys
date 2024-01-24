import { Controller, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { InjectFeature } from '@dms/auth/lib/decorators/feature-inject.decorator';
import { JwtAuthGuard } from '@dms/auth/lib/guards/jwt.guard';
import { FeatureGuard } from '@dms/auth/lib/guards/features.guard';
import { RequireFeatures } from '@dms/auth/lib/decorators/feature-require.decorator';
import { FilterQuery, ListQuery, RequestBody, SerializeGroups } from '@dms/crud';
import { Response } from 'express';
import { GetUserDetailParams } from '../../types/user/GetUserDetailParams';
import { LocalGroupListFeature } from './features/group-list.feature';
import { LocalGroupEntity } from '../../persistence/entities/LocalGroup.entity';
import { LocalGroupDetailFeature } from './features/group-get.feature';
import { Validate } from '@dms/http-base/lib/decorators/validate.decorator';
import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';
import { LocalGroupCreateFeature } from './features/group-create.feature';
import { LocalUserEditFeature } from '../user/features/user-edit.feature';
import { GetGroupDetailParams } from '../../types/user/GetGroupDetailParams';
import { LocalGroupEditFeature } from './features/user-edit.feature';

@Controller('/group')
export class GroupController {
    @Get('/features/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalGroupCreateFeature)
    public async get_features(
        @Query() query: FilterQuery<{ feature: string }>,
        @InjectFeature(LocalGroupCreateFeature) create: LocalGroupCreateFeature
    ) {
        return { features: await create.getFeatures(query) };
    }

    @Get('/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalGroupListFeature)
    @SerializeGroups(LocalGroupEntity.LIST)
    @Validate()
    public async list(
        @Res({ passthrough: true }) res: Response,
        @Query() query: ListQuery<LocalGroupEntity>,
        @InjectFeature(LocalGroupListFeature) list: LocalGroupListFeature
    ) {
        return await list.list(res, query);
    }

    @Get('/:id/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalGroupDetailFeature)
    @SerializeGroups(LocalGroupEntity.SELECT)
    @Validate()
    public async detail(
        @Res({ passthrough: true }) res: Response,
        @Param() params: GetGroupDetailParams,
        @InjectFeature(LocalGroupDetailFeature) detail: LocalGroupDetailFeature
    ) {
        return await detail.get(params.id);
    }

    @Post('/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalGroupCreateFeature)
    @SerializeGroups(LocalGroupEntity.SELECT)
    public async create(
        @RequestBody(LocalGroupEntity.CREATE) body: LocalGroupEntity,
        @InjectFeature(LocalGroupCreateFeature) create: LocalGroupCreateFeature
    ) {
        return await create.create(body);
    }

    @Put('/:id/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalGroupEditFeature)
    @SerializeGroups(LocalUserEntity.SELECT)
    public async edit(
        @Param() param: GetGroupDetailParams,
        @RequestBody(LocalGroupEntity.EDIT) body: LocalGroupEntity,
        @InjectFeature(LocalGroupEditFeature) edit: LocalGroupEditFeature
    ) {
        return await edit.update(param.id, body);
    }
}
