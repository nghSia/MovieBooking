import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { BadRequestException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './Interface/reservation.interface';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  beforeEach(async () => {
    const mockReservationService = {
      create: jest.fn(),
      update: jest.fn(),
      createReservation: jest.fn(),
      updateReservation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        { provide: ReservationService, useValue: mockReservationService },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('Le contrôleur doit être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('createReservation', () => {
    it('✅ Crée une réservation avec succès', async () => {
      const dto: CreateReservationDto = {
        date: new Date('2025-02-05T14:00:00Z'),
        userId: 12445,
        filmId: 12445,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockReservation: Reservation = {
        id: 1,
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockReservation);

      const result = await controller.create(dto);

      expect(result).toEqual(mockReservation);
    });

    it('⚠️ Retourne une erreur si la réservation existe déjà', async () => {
      const dto: CreateReservationDto = {
        date: new Date('2025-02-05T14:00:00Z'),
        userId: 12445,
        filmId: 12445,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException('Réservation déjà existante'));

      await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateReservation', () => {
    it('✅ Met à jour une réservation avec succès', async () => {
      const dto: UpdateReservationDto = {
        date: new Date('2025-02-05T14:00:00Z'),
        filmId: 15482,
        userId: 4,
        updatedAt: new Date()
      };

      const mockUpdatedReservation: Reservation = {
        id: 1,
        ...dto,
        createdAt: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdatedReservation);

      const result = await controller.update(1, dto);
      expect(result).toEqual(mockUpdatedReservation);
    });

    it('⚠️ Retourne une erreur si la réservation n\'existe pas', async () => {
      const dto: UpdateReservationDto = {
        date: new Date('2025-02-05T14:00:00Z'),
        filmId: 15482,
        userId: 4,
        updatedAt: new Date()
      };

      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException('Réservation non trouvée'));

      await expect(controller.update(1, dto)).rejects.toThrow(BadRequestException);
    });
  });
});
