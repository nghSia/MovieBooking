import { BadRequestException, Body, Controller, HttpException, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { loginDTO } from 'src/DTO/loginDTO';
import { UserService } from './user.service';
import { registerDTO } from 'src/DTO/registerDTO';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

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

    @Post('protected')
    @UseGuards(JwtAuthGuard)
    testG(){
        return "recupere";
    }
}
