import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Reservation } from './Interface/reservation.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly s_reservationService: ReservationService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'creation reservation' })
  @ApiResponse({ status: 201, description: 'reservation cree avec succes' })
  @ApiResponse({ status: 400, description: 'Erreurs lors de la creation, informations invalides' })
  create(@Body() createReservationDto: CreateReservationDto) : Promise<Reservation>{
    return this.s_reservationService.create(createReservationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'recuperere tous les reservations faites par l\'utilisateur' })
  @ApiResponse({ status: 201, description: 'liste recuperee' })
  @ApiResponse({ status: 400, description: 'Erreurs lors de la recuperation, informations invalides' })
  findAll(@Query('userId') p_userId : number) : Promise<Reservation[]> {
    return this. s_reservationService.findAll(p_userId);
  }

  @Patch('patch/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') p_id: number, @Body() p_updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    return this.s_reservationService.update(p_id, p_updateReservationDto);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') p_id: number) {
    return this.s_reservationService.remove(p_id);
  }
}
