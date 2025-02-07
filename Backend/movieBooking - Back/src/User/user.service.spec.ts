import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException } from '@nestjs/common';

import { loginDTO } from '../DTO/loginDTO';
import { registerDTO } from '../DTO/registerDTO';

const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const jwtMock = {
  sign: jest.fn(),
};

let service: UserService;
let prisma: typeof prismaMock;
let jwtService: typeof jwtMock;

describe('UserService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: JwtService, useValue: jwtMock },
        { provide: PrismaClient, useFactory: () => prismaMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaClient>(PrismaClient) as unknown as typeof prismaMock;
    jwtService = jwtMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('validateUser', () => {
    it('should return a JWT token if credentials are correct', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jwtService.sign.mockReturnValue('mockToken');

      const result = await service.validateUser({ email: 'test@test.com', password: 'password123' });

      expect(result).toBe('mockToken');
    });

    it('should throw BadRequestException if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.validateUser({ email: 'wrong@test.com', password: 'password' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(
        service.validateUser({ email: 'test@test.com', password: 'wrongpass' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('registerUser', () => {
    it('should create a new user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const mockUser = {
        id: 6,
        email: 'new@test.com',
        username: 'newuser',
        password: 'password123',
        role: 'USER',
        createdAt: new Date(),
      };

      prisma.user.create.mockResolvedValue(mockUser);

      const result = await service.registeruser({
        email: 'new@test.com',
        username: 'newuser',
        password: 'password123',
        role: 'USER',
      });

      expect(result).toEqual({
        message: 'Successfully create user',
        user: { 
          id: 6, 
          email: 'new@test.com', 
          username: 'newuser' 
        },
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'new@test.com' }
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        username: 'testuser',
        password: 'hashedpass',
        role: 'USER',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValueOnce(mockUser);

      await expect(
        service.registeruser({
          email: 'test@test.com',
          username: 'testuser',
          password: 'password123',
          role: 'USER',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});