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
    async validateUser({email, password} : loginDTO){

        const v_findUser = await prisma.user.findUnique({ where : {email}});
        console.log("EQOIJGQ : " + v_findUser?.username);
        if (!v_findUser) {
            throw new BadRequestException('User not found, verify informatiosn');
        }
        const v_isPasswordValid = await bcrypt.compare(password, v_findUser.password);
        if (v_isPasswordValid){
            const {password, ...user} = v_findUser;
            return this.s_jwtService.sign(user);            
        } else {
            throw new BadRequestException('User not found, verify informatiosn');       
        }
        
    }

    //inserer l'utilisateur dans la base de donne a condition que celui-ci n'existe pas deja
    async registeruser({email, username, password, role,} : registerDTO){
        const v_existingUser = await prisma.user.findUnique({ where: {email}});

        if(v_existingUser){
            throw new ConflictException("Existing User");
        }

        if(password.length < 6){
            throw new BadRequestException("Password is not strong enough");
        }
        const v_hashPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
              email,
              username,
              password: v_hashPassword,
              role: role || 'USER',
            },
        });

        return {
            message: 'Utilisateur créé avec succès',
            user: { id: newUser.id, email: newUser.email, username: newUser.username },
        };
    }
}
