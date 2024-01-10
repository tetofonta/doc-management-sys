import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { LoadConfig } from '@dms/config';

@LoadConfig('web')
export class WebConfig {
    @IsString()
    @IsDefined()
    public readonly base_path: string = '';

    @IsInt()
    @Min(1)
    @Max(65535)
    @IsNotEmpty()
    public readonly port: number = 3000;

    @IsString()
    @IsNotEmpty()
    public readonly bind_address: string = '127.0.0.1';

    @IsBoolean()
    @IsNotEmpty()
    public readonly log_requests: boolean = false;
}
