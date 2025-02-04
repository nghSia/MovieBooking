import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';


export class registerDTO {
    @IsEmail()
    email : string;

    @IsNotEmpty()
    @MinLength(6)
    password : string;

    @IsNotEmpty()
    username : string;

    @IsNotEmpty()
    role: string;
}