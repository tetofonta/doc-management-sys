import { Controller, Get } from '@nestjs/common';
import { AuthService } from '@dms/auth/lib/auth.service';

@Controller('/.well-known')
export class WellKnownController {
    constructor(private readonly authService: AuthService) {}

    @Get('jwks.json')
    public async get_json_key_set() {
        return this.authService.json_web_key_set();
    }
}
