import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { AxiosResponse, AxiosHeaders } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

type MovieData = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
};

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('getNowPlaying', () => {
    it('✅ should return a list of now playing movies', async () => {
      const headers = new AxiosHeaders();
      const mockResponse: AxiosResponse<{ results: MovieData[] }> = {
        data: {
          results: [
            { id: 1, title: 'Movie Title', overview: 'An action movie', release_date: '2024-06-10' },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: headers,
        config: { headers: headers } as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockResponse));

      const result = await service.getNowPlaying();

      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/now_playing',
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODRkZjlmMDU4NjYxN2JkZjMzNDdkOTY2OTFmMTI4OSIsIm5iZiI6MTczODc0NDM4Mi42ODk5OTk4LCJzdWIiOiI2N2EzMjIzZWFlZWU1YzBlMjU5ZmQ2NGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.BekVXB2_Sncj7tqkGXusodKwBkYZiyu57gz2wrdzSgk'
          }
        }
      );
    });

    it('⚠️ should throw BadRequestException on error', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        throwError(() => new BadRequestException('Error fetching now playing movies'))
      );

      await expect(service.getNowPlaying()).rejects.toThrow(BadRequestException);
    });
  });
});
