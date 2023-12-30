import { IsNotEmpty, ValidateNested, IsString, IsDefined } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { JwtConfig } from './JwtConfig';

export class AuthConfig {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => JwtConfig)
    readonly jwt: JwtConfig;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly authorization_header: string = 'Authorization';

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly token_header: string = 'X-Auth-Token';

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly refresh_token_header: string = 'X-Refresh-Token';

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly old_token_header: string = 'X-Old-Token';

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly refresh_token_hmac_algo: string = 'sha256';

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly refresh_token_hmac_secret: string;
}
