import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Res,
    SerializeOptions,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { InjectFeature } from '@dms/auth/lib/decorators/feature-inject.decorator';
import { LocalUserListFeature } from './features/user-list.feature';
import { JwtAuthGuard } from '@dms/auth/lib/guards/jwt.guard';
import { FeatureGuard } from '@dms/auth/lib/guards/features.guard';
import { RequireFeatures } from '@dms/auth/lib/decorators/feature-require.decorator';
import { LocalUserEntity } from '../../persistence/entities/LocalUser.entity';
import { CRUD_CREATE, CRUD_LIST, CRUD_SELECT, ListQuery } from '@dms/crud';
import { Response } from 'express';
import { LocalUserDetailFeature } from './features/user-get.feature';
import { GetUserDetailParams } from '../../types/user/GetUserDetailParams';
import { LocalUserCreateFeature } from './features/user-create.feature';

@Controller('/user')
export class UserController {
    @Get('/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @SerializeOptions({
        groups: [CRUD_LIST(LocalUserEntity)],
    })
    @RequireFeatures(LocalUserListFeature)
    public async list(
        @Res({ passthrough: true }) res: Response,
        @Query() query: ListQuery<LocalUserEntity>,
        @InjectFeature(LocalUserListFeature) list: LocalUserListFeature
    ) {
        return await list.list(res, query);
    }

    @Get('/:id/')
    @UseGuards(JwtAuthGuard, FeatureGuard)
    @SerializeOptions({
        groups: [CRUD_SELECT(LocalUserEntity)],
    })
    @RequireFeatures(LocalUserDetailFeature)
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
    @UsePipes(new ValidationPipe({ groups: [CRUD_CREATE(LocalUserEntity)], transform: true }))
    public async create(
        @Body() body: LocalUserEntity,
        @InjectFeature(LocalUserCreateFeature) create: LocalUserCreateFeature
    ) {
        return await create.create(body);
    }
}
