import { BadRequestException, Body, Controller, HttpException, Post, UnauthorizedException } from '@nestjs/common';
import { loginDTO } from 'src/DTO/loginDTO';
import { UserService } from './user.service';
import { registerDTO } from 'src/DTO/registerDTO';

@Controller('user-controller')
export class UserController {

    constructor
    (
        private s_userService : UserService
    ){}

    @Post('login')
    async login(@Body() p_login : loginDTO){

        return await this.s_userService.validateUser(p_login);
    }

    @Post('register')
    async register(@Body() p_register : registerDTO){
        return await this.s_userService.registeruser(p_register);
    }
}
