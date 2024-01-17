import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { InjectFeature } from '@dms/auth/lib/decorators/feature-inject.decorator';
import { JwtAuthGuard } from '@dms/auth/lib/guards/jwt.guard';
import { FeatureGuard } from '@dms/auth/lib/guards/features.guard';
import { RequireFeatures } from '@dms/auth/lib/decorators/feature-require.decorator';
import { ListQuery, SerializeGroups } from '@dms/crud';
import { Response } from 'express';
import { GetUserDetailParams } from '../../types/user/GetUserDetailParams';
import { LocalGroupListFeature } from './features/group-list.feature';
import { LocalGroupEntity } from '../../persistence/entities/LocalGroup.entity';
import { LocalGroupDetailFeature } from './features/group-get.feature';
import { Validate } from '@dms/http-base/lib/decorators/validate.decorator';

@Controller('/group')
export class GroupController {
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
        @Param() params: GetUserDetailParams,
        @InjectFeature(LocalGroupDetailFeature) detail: LocalGroupDetailFeature
    ) {
        return await detail.get(params.id);
    }
}
