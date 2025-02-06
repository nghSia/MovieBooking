import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateReservationDto {
    @ApiProperty({ example: '2025-02-01T14:00:00Z', description: 'date de la seance reserve' })
    @IsOptional()
    date : Date;
    @ApiProperty({ example: '15482', description: 'film souhaite' })
    @IsOptional()
    filmId : number;
    userId : number;
    updatedAt : Date;
}
