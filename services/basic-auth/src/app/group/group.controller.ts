import { Controller, Get, Param, Query, Res, SerializeOptions, UseGuards } from '@nestjs/common';
import { InjectFeature } from '@dms/auth/lib/decorators/feature-inject.decorator';
import { JwtAuthGuard } from '@dms/auth/lib/guards/jwt.guard';
import { FeatureGuard } from '@dms/auth/lib/guards/features.guard';
import { RequireFeatures } from '@dms/auth/lib/decorators/feature-require.decorator';
import { CRUD_LIST, CRUD_SELECT, ListQuery } from '@dms/crud';
import { Response } from 'express';
import { GetUserDetailParams } from '../../types/user/GetUserDetailParams';
import { LocalGroupListFeature } from './features/group-list.feature';
import { LocalGroupEntity } from '../../persistence/entities/LocalGroup.entity';
import { LocalGroupDetailFeature } from './features/group-get.feature';

@Controller('/group')
export class GroupController {
    @Get('/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @SerializeOptions({
        groups: [CRUD_LIST(LocalGroupEntity)],
    })
    @RequireFeatures(LocalGroupListFeature)
    public async list(
        @Res({ passthrough: true }) res: Response,
        @Query() query: ListQuery<LocalGroupEntity>,
        @InjectFeature(LocalGroupListFeature) list: LocalGroupListFeature
    ) {
        return await list.list(res, query);
    }

    @Get('/:id/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @SerializeOptions({
        groups: [CRUD_SELECT(LocalGroupEntity)],
    })
    @RequireFeatures(LocalGroupDetailFeature)
    public async detail(
        @Res({ passthrough: true }) res: Response,
        @Param() params: GetUserDetailParams,
        @InjectFeature(LocalGroupDetailFeature) detail: LocalGroupDetailFeature
    ) {
        return await detail.get(params.id);
    }
}
