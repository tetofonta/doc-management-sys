import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginPostBody {
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly username: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    public readonly password: string;
}
