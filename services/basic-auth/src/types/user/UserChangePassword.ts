import { IsDefined, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UserChangePasswordBody {
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    public readonly current_password: string;

    @IsString()
    @IsDefined()
    @IsStrongPassword()
    @IsNotEmpty()
    public readonly new_password: string;
}
