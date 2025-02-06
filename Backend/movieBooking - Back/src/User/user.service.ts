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

    //Valider si les informations de connexion sont correctes
    async validateUser(p_loginDto : loginDTO){

        const v_findUser = await prisma.user.findUnique({ where : {
            email : p_loginDto.email
        }});
        console.log("EQOIJGQ : " + v_findUser?.username);
        if (!v_findUser) {
            throw new BadRequestException('User not found, verify informatiosn');
        }
        const v_isPasswordValid = await bcrypt.compare(p_loginDto.password, v_findUser.password);
        if (v_isPasswordValid){
            const {password, ...user} = v_findUser;
            return this.s_jwtService.sign(user);            
        } else {
            throw new BadRequestException('User not found, verify informatiosn');       
        }
        
    }

    //inserer l'utilisateur dans la base de donne a condition que celui-ci n'existe pas deja
    async registeruser(p_registerDto : registerDTO){
        const v_existingUser = await prisma.user.findUnique({ where: {
            email : p_registerDto.email
        }});

        if(v_existingUser){
            throw new ConflictException("Existing User");
        }

        if(p_registerDto.password.length < 6){
            throw new BadRequestException("Password is not strong enough");
        }
        const v_hashPassword = await bcrypt.hash(p_registerDto.password, 10);

        const newUser = await prisma.user.create({
            data: {
              email : p_registerDto.email,
              username : p_registerDto.username,
              password: p_registerDto.password,
              role: p_registerDto.role || 'USER',
            },
        });

        return {
            message: 'Successfully create user',
            user: { id: newUser.id, email: newUser.email, username: newUser.username },
        };
    }
}
