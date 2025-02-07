import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
    @ApiProperty({ example: '2025-02-01T14:00:00Z', description: 'date de la seance reserve' })
    @IsNotEmpty()
    date : Date;
    @ApiProperty({ example: '12445', description: 'Id de l\'utilisateur ayant reserve'})
    @IsNotEmpty()
    userId : number;
    @ApiProperty({ example: '12445', description: 'Id du film'})
    @IsNotEmpty()
    filmId : number;
    createdAt : Date;
    updatedAt : Date;
}
