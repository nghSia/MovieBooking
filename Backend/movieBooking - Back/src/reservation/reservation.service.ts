import { BadRequestException, ConflictException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as dayjs from 'dayjs';
import { Reservation } from './Interface/reservation.interface';
import { addHours, subHours } from 'date-fns';
import { MoviesService } from './../movies/movies.service';
import { Movie } from './../interfaces/movie.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Injectable()
export class ReservationService {

  constructor(
    private readonly s_movieService : MoviesService
  ){}

  async create(p_reservationDto : CreateReservationDto) : Promise<Reservation> {
    

    const v_userExistence = await prisma.user.findUnique({
      where: { id : p_reservationDto.userId }
    });
    if(!v_userExistence){
      throw new BadRequestException("utilisateur n\'existe pas");
    }

    const v_film = await this.s_movieService.getById(p_reservationDto.filmId);
    console.log("film trouve : " + v_film);
    if(!v_film){
      throw new BadRequestException("le film n\'existe pas");
    }

    const v_temps2Avant = subHours (p_reservationDto.date, 2);
    const v_temps2Apres = addHours (p_reservationDto.date, 2);
    const v_conflictReservation = await prisma.reservation.findFirst(
      {where: 
        {userId : p_reservationDto.userId, 
         date : {
            gte : v_temps2Avant,
            lt : v_temps2Apres
         }
        }
      });

    if (v_conflictReservation) {
      throw new ConflictException("deja une seance reservee a cette date");
    }

    return await prisma.reservation.create({
      data: {
        date : p_reservationDto.date,
        createdAt : dayjs().toDate(),
        updatedAt : dayjs().toDate(),
        userId: p_reservationDto.userId,
        filmId: p_reservationDto.filmId
      },
    });
  }

  async findAll(p_userId : number) : Promise<Reservation[]>{
    const v_userExistence = await prisma.user.findUnique({
      where: { id : p_userId }
    });
    if(!v_userExistence){
      throw new BadRequestException("utilisateur n\'existe pas");
    }

    return await prisma.reservation.findMany({
      where: { userId : p_userId }
    });
  }

  async update(p_id: number, p_updateReservationDto: UpdateReservationDto) : Promise<Reservation> {
    const v_reservation = await prisma.reservation.findFirst({where : {id: p_id}});
    if (!v_reservation) {
      throw new NotFoundException("Réservation non trouvée");
    }

    p_updateReservationDto.date = p_updateReservationDto.date || v_reservation.date;

    const v_film = await this.s_movieService.getById(p_updateReservationDto.filmId);
    if(!v_film){
      throw new BadRequestException("le film n\'existe pas");
    }

    p_updateReservationDto.filmId = p_updateReservationDto.filmId || v_reservation.filmId;
    p_updateReservationDto.userId = p_updateReservationDto.userId || v_reservation.userId;
    p_updateReservationDto.updatedAt = dayjs().toDate();

    return await prisma.reservation.update({
      where : { id : p_id },
      data : p_updateReservationDto 
    });
  }

  async remove(p_id: number) {
    const v_reservation = await prisma.reservation.findFirst({where : {id: p_id}});
    if (!v_reservation) {
      throw new NotFoundException("Réservation non trouvée");
    }

    await prisma.reservation.delete({where : {id : p_id}});

    return `la reservation #${p_id} pour le film ${v_reservation.filmId} a ete supprime`;
  }
}
