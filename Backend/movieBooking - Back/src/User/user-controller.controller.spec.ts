import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user-controller.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { loginDTO } from './../DTO/loginDTO';
import { registerDTO } from './../DTO/registerDTO';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const mockUserService = {
      validateUser: jest.fn(),
      registeruser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('Le contrôleur doit être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('✅ Retourne un token JWT si la connexion est réussie', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue('mockToken');

      const result = await controller.login({ email: 'test@test.com', password: 'password123' });
      expect(result).toBe('mockToken');
    });

    it('⚠️ Retourne une erreur si les identifiants sont incorrects', async () => {
      jest.spyOn(service, 'validateUser').mockRejectedValue(new BadRequestException());

      await expect(controller.login({ email: 'wrong@test.com', password: 'wrong' }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('register', () => {
    it('✅ Inscrit un utilisateur avec succès', async () => {
      jest.spyOn(service, 'registeruser').mockResolvedValue({
        message: 'Successfully create user',
        user: { id: 1, email: 'test@test.com', username: 'testuser' },
      });

      const result = await controller.register({
        email: 'test@test.com',
        username: 'testuser',
        password: 'password123',
        role: 'USER',
      });

      expect(result).toEqual({
        message: 'Successfully create user',
        user: { id: 1, email: 'test@test.com', username: 'testuser' },
      });
    });

    it('⚠️ Retourne une erreur si l’utilisateur existe déjà', async () => {
      jest.spyOn(service, 'registeruser').mockRejectedValue(new ConflictException());

      await expect(controller.register({
        email: 'test@test.com',
        username: 'testuser',
        password: 'password123',
        role: 'USER',
      })).rejects.toThrow(ConflictException);
    });
  });
});
