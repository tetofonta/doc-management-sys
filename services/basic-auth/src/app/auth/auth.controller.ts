import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthLoginPostBody } from '../../types/auth/auth-login.post';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/')
    @HttpCode(200)
    public async login(
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
        @Body() body: AuthLoginPostBody
    ) {
        return await this.authService.authenticate(body.username, body.password, res, req);
    }
}

