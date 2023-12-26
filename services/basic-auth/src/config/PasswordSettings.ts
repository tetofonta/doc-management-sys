import { IsBoolean, IsDefined, IsInt, IsString, Min } from 'class-validator';

export class PasswordSettings {
    @IsDefined()
    @IsInt()
    @Min(0)
    hashLength: number = 32;

    @IsDefined()
    @IsInt()
    @Min(0)
    memoryCost: number = 1024;

    @IsDefined()
    @IsInt()
    @Min(0)
    parallelism: number = 8;

    @IsDefined()
    @IsInt()
    @Min(0)
    saltLength: number = 16;

    @IsDefined()
    @IsInt()
    @Min(0)
    timeCost: number = 20;

    @IsDefined()
    @IsBoolean()
    createUser: boolean = true;

    @IsDefined()
    @IsBoolean()
    createGroup: boolean = true;

    @IsDefined()
    @IsString()
    userGroupName: string = 'user';

    @IsDefined()
    @IsString()
    adminUserName: string = 'admin';

    @IsDefined()
    @IsString({ each: true })
    defaultGroupFeatures: string[] = ['auth:self', 'token:info'];
}
