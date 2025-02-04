import { Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';
import { loginDTO } from 'src/DTO/loginDTO';
import { UserService } from './user.service';
import { registerDTO } from 'src/DTO/registerDTO';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('user-controller')
export class UserController {

    constructor
    (
        private s_userService : UserService
    ){}

    @Post('login')
    @ApiOperation({ summary: 'Se connecter a un compte existant' })
    @ApiResponse({ status: 201, description: 'connexion effectuee avec succès' })
    @ApiResponse({ status: 400, description: 'Erreurs lors de la connexion, informations invalides' })
    async login(@Body() p_login : loginDTO){

        return await this.s_userService.validateUser(p_login);
    }

    @Post('register')
    @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
    @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
    @ApiResponse({ status: 400, description: 'Données invalides' })
    async register(@Body() p_register : registerDTO){
        return await this.s_userService.registeruser(p_register);
    }

    @Post('protected')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Endpoint protégé, nécessite un token Jwt' })
    @ApiResponse({ status: 200, description: 'Accès accordé' })
    @ApiResponse({ status: 400, description: 'Permissions manquantes' })
    testG(){
        return "recupere";
    }
}
