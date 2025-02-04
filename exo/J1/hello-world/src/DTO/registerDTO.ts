import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class registerDTO {
    @ApiProperty({ example: 'pseudo@gmail.com', description: 'Adresse email unique de l\'utilisateur' })
    @IsEmail()
    email : string;

    @ApiProperty({ example: 'password123', description: 'Mot de passe de l\'utilisateur', minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    password : string;

    @ApiProperty({ example: '[toto]', description: 'Nom d\'utilisateur' })
    @IsNotEmpty()
    username : string;

    @ApiProperty({ example: 'USER/ADMIN', description: 'Rôle de l\'utilisateur (ex: ADMIN, USER)' })
    @IsNotEmpty()
    role: string;
}