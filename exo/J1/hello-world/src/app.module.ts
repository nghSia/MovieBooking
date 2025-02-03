import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthControllerController } from './Authentification/auth-controller.controller';
import { AuthModuleModule } from './Authentification/auth-module.module';
import { AuthService } from './Authentification/auth-service.service';

@Module({
  imports: [AuthModuleModule],
  controllers: [AppController, AuthControllerController],
  providers: [AppService, AuthService],
})
export class AppModule {}
