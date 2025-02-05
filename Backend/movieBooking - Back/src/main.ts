import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true 
  }));  

  const v_info = new DocumentBuilder()
    .setTitle('MovieBooking API')
    .setDescription('API pour la gestion des utilisateurs et des réservations de films')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    app.use((req, res, next) => {
      console.log(`➡️ Requête reçue: ${req.method} ${req.url}`);
      next();
    });

  
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Authorization, Content-Type',
    });

  const document = SwaggerModule.createDocument(app, v_info);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
