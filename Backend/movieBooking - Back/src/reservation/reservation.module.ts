import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { MoviesModule } from 'src/movies/movies.module';
import { UserModule } from 'src/User/user.module';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [MoviesModule, UserModule],
})
export class ReservationModule {}
