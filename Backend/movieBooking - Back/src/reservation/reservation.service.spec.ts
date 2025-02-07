import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaClient } from '@prisma/client';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { MoviesService } from '../movies/movies.service';
import { AxiosResponse } from 'axios';
import { Movie } from '../interfaces/movie.interface';

describe('ReservationService', () => {
  let service: ReservationService;
  let movieService: jest.Mocked<MoviesService>;
  let prisma: any; 

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
    reservation: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: MoviesService,
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: PrismaClient,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    movieService = module.get<MoviesService>(MoviesService) as jest.Mocked<MoviesService>;
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  const createEmptyMovieResponse = (): Promise<AxiosResponse<Movie[]>> => Promise.resolve({
    data: [],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} } as any
  });

  const createMockMovieResponse = (movieData: Partial<Movie>): Promise<AxiosResponse<Movie[]>> => Promise.resolve({
    data: [{
      id: movieData.id || 1,
      title: movieData.title || 'Test Movie',
      overview: movieData.overview || 'Test Overview',
      release_date: movieData.release_date || '2024-01-01',
      vote_average: movieData.vote_average || 7.5,
      poster_path: movieData.poster_path || '/test.jpg'
    }],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} } as any
  });

  const createReservationData = (overrides = {}) => ({
    date: new Date('2024-01-01'),
    userId: 1,
    filmId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  });

  it('should throw BadRequestException if user does not exist', async () => {
    const dto = createReservationData({ userId: 999 });

    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if movie does not exist', async () => {
    const dto = createReservationData({ filmId: 9999 });

    prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
    movieService.getById.mockResolvedValue(Promise.resolve({
      data: [],
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config: { headers: {} } as any
    }));
    prismaMock.reservation.findFirst.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw ConflictException if reservation already exists within 2 hours', async () => {
    const date = new Date('2024-01-01T10:00:00Z');
    const dto = createReservationData({ date });

    prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
    movieService.getById.mockResolvedValue(Promise.resolve({
      data: [{ id: 1, title: 'Test Movie', overview: 'Test', release_date: '2024-01-01', vote_average: 7.5, poster_path: '/test.jpg' }],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as any
    }));
    
    const existingReservation = {
      id: 1,
      date: date,
      userId: dto.userId,
      filmId: dto.filmId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    prismaMock.reservation.findFirst.mockResolvedValue(existingReservation);

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('should create a reservation if all parameters are valid', async () => {
    const reservationData = createReservationData();

    prismaMock.user.findUnique.mockResolvedValue({ id: 1 });
    movieService.getById.mockResolvedValue(Promise.resolve({
      data: [{ id: 1, title: 'Test Movie', overview: 'Test', release_date: '2024-01-01', vote_average: 7.5, poster_path: '/test.jpg' }],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as any
    }));
    prismaMock.reservation.findFirst.mockResolvedValue(null);
    prismaMock.reservation.create.mockResolvedValue({
      id: 1,
      ...reservationData
    });

    const result = await service.create(reservationData);
    expect(result).toEqual({
      id: 1,
      ...reservationData
    });
  });
});