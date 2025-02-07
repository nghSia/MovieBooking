import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { loginDTO } from 'src/DTO/loginDTO';
import { registerDTO } from 'src/DTO/registerDTO';
const prisma = new PrismaClient();
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(
        private s_jwtService : JwtService
    ){}

    async validateUser(p_loginDto : loginDTO){

        const v_findUser = await prisma.user.findUnique({ where : {
            email : p_loginDto.email
        }});
        if (!v_findUser) {
            throw new BadRequestException('utilisateur n\'existe pas verifie les informations');
        }
        const v_isPasswordValid = await bcrypt.compare(p_loginDto.password, v_findUser.password);
        if (v_isPasswordValid){
            const {password, ...user} = v_findUser;
            return this.s_jwtService.sign(user);            
        } else {
            throw new BadRequestException('mot de passe incorrect');       
        }
        
    }

    async registeruser(p_registerDto : registerDTO){
        const v_existingUser = await prisma.user.findUnique({ where: {
            email : p_registerDto.email
        }});

        if(v_existingUser){
            throw new ConflictException("utilisateur existant");
        }

        if(p_registerDto.password.length < 6){
            throw new BadRequestException("le mot de passe n\'est pas assez fort");
        }
        const v_hashPassword = await bcrypt.hash(p_registerDto.password, 10);

        const newUser = await prisma.user.create({
            data: {
              email : p_registerDto.email,
              username : p_registerDto.username,
              password: v_hashPassword,
              role: p_registerDto.role || 'USER',
            },
        });

        return {
            message: 'inscription reussie',
            user: { id: newUser.id, email: newUser.email, username: newUser.username },
        };
    }
}
