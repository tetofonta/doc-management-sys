import { Controller, Delete, Get, Param, Patch, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { InjectFeature } from '@dms/auth/lib/decorators/feature-inject.decorator';
import { LocalUserListFeature } from './features/user-list.feature';
import { JwtAuthGuard } from '@dms/auth/lib/guards/jwt.guard';
import { FeatureGuard } from '@dms/auth/lib/guards/features.guard';
import { RequireFeatures } from '@dms/auth/lib/decorators/feature-require.decorator';
import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';
import { FilterQuery, ListQuery, RequestBody, SerializeGroups } from '@dms/crud';
import { Response } from 'express';
import { LocalUserDetailFeature } from './features/user-get.feature';
import { GetUserDetailParams } from '../../types/user/GetUserDetailParams';
import { LocalUserCreateFeature } from './features/user-create.feature';
import { LocalUserEditFeature } from './features/user-edit.feature';
import { LocalUserDeleteFeature } from './features/user-delete.feature';
import { LocalUserResetFeature } from './features/user-reset-password.feature';
import { Validate } from '@dms/http-base/lib/decorators/validate.decorator';

@Controller('/user')
export class UserController {
    @Get('/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalUserListFeature)
    @SerializeGroups(LocalUserEntity.LIST)
    @Validate()
    public async list(
        @Res({ passthrough: true }) res: Response,
        @Query() query: ListQuery<LocalUserEntity>,
        @InjectFeature(LocalUserListFeature) list: LocalUserListFeature
    ) {
        return await list.list(res, query);
    }

    @Get('/:id/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalUserDetailFeature)
    @Validate()
    @SerializeGroups(LocalUserEntity.SELECT)
    public async detail(
        @Res({ passthrough: true }) res: Response,
        @Param() params: GetUserDetailParams,
        @InjectFeature(LocalUserDetailFeature) detail: LocalUserDetailFeature
    ) {
        return await detail.get(params.id);
    }

    @Post('/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalUserCreateFeature)
    @SerializeGroups(LocalUserEntity.SELECT)
    public async create(
        @RequestBody(LocalUserEntity.CREATE) body: LocalUserEntity,
        @InjectFeature(LocalUserCreateFeature) create: LocalUserCreateFeature
    ) {
        return await create.create(body);
    }

    @Put('/:id/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalUserEditFeature)
    @SerializeGroups(LocalUserEntity.SELECT)
    public async edit(
        @Param() param: GetUserDetailParams,
        @RequestBody(LocalUserEntity.EDIT) body: LocalUserEntity,
        @InjectFeature(LocalUserEditFeature) edit: LocalUserEditFeature
    ) {
        return await edit.update(param.id, body);
    }

    @Delete('/:id/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalUserDeleteFeature)
    @Validate()
    public async delete(
        @Param() param: GetUserDetailParams,
        @InjectFeature(LocalUserDeleteFeature) del: LocalUserDeleteFeature
    ) {
        return await del.delete(param.id);
    }

    @Delete('/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalUserDeleteFeature)
    @Validate()
    public async deleteMany(
        @Res({ passthrough: true }) res: Response,
        @Query() query: FilterQuery<LocalUserEntity>,
        @InjectFeature(LocalUserDeleteFeature) del: LocalUserDeleteFeature
    ) {
        return await del.deleteMany(res, query);
    }

    @Patch('/:id/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @RequireFeatures(LocalUserResetFeature)
    @Validate()
    public async reset(
        @Param() param: GetUserDetailParams,
        @InjectFeature(LocalUserResetFeature) rst: LocalUserResetFeature
    ) {
        return await rst.resetPassword(param.id);
    }
}
