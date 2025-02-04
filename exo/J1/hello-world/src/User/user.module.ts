import { Module } from '@nestjs/common';
import { UserController } from './user-controller.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import 'dotenv/config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.jwtSecret,
      signOptions: {expiresIn : '1h'},
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService, JwtModule]
})
export class UserModule {}
