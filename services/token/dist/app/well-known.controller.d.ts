import { AuthService } from '@dms/auth/lib/auth.service';
export declare class WellKnownController {
    private readonly authService;
    constructor(authService: AuthService);
    get_json_key_set(): Promise<any>;
}
