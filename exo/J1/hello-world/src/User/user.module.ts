import { Module } from '@nestjs/common';
import { UserController } from './user-controller.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import 'dotenv/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.jwtSecret,
      signOptions: {expiresIn : '1h'},
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService, JwtStrategy],
  exports: [UserService, JwtModule]
})
export class UserModule {}
