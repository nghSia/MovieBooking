import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Reservation } from './Interface/reservation.interface';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly s_reservationService: ReservationService
  ) {}

  @Post()
  @ApiOperation({ summary: 'creation reservation' })
  @ApiResponse({ status: 201, description: 'reservation cree avec succes' })
  @ApiResponse({ status: 400, description: 'Erreurs lors de la creation, informations invalides' })
  create(@Body() createReservationDto: CreateReservationDto) : Promise<Reservation>{
    return this.s_reservationService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'recuperere tous les reservations faites par l\'utilisateur' })
  @ApiResponse({ status: 201, description: 'liste recuperee' })
  @ApiResponse({ status: 400, description: 'Erreurs lors de la recuperation, informations invalides' })
  findAll(@Query('userId') p_userId : number) : Promise<Reservation[]> {
    return this. s_reservationService.findAll(p_userId);
  }

  @Patch('patch/:id')
  update(@Param('id') p_id: number, @Body() p_updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    return this.s_reservationService.update(p_id, p_updateReservationDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') p_id: number) {
    return this.s_reservationService.remove(p_id);
  }
}
