import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/')
    @HttpCode(204)
    public async get(@Res({ passthrough: true }) res: Response) {
        return this.authService.authenticate('pippo', 'pera', res);
    }
}
