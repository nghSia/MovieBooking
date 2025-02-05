import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './User/user.module';
import { UserController } from './User/user-controller.controller';
import { UserService } from './User/user.service';
import { PassportModule } from '@nestjs/passport';
import { MoviesModule } from './movies/movies.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UserModule,
    PassportModule,
    MoviesModule,
    HttpModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
