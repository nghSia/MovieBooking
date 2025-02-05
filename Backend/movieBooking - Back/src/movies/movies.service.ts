import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { log } from 'console';
import 'dotenv/config';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { Movie } from 'src/interfaces/movie.interface';


@Injectable()
export class MoviesService {

    constructor
    (
        private readonly s_httpService : HttpService
    )
    {}
    private readonly v_apiUrl = process.env.MovieApiUrl;
    private readonly v_apiToken = process.env.MovieAccesToken;
    private readonly v_apiKey = process.env.MovieApiKey;

    async getByName(p_name : string) : Promise<AxiosResponse<Movie[]>>{
        try{
            const v_movies = await firstValueFrom(this.s_httpService.get(`${this.v_apiUrl}/search/keyword`,{
                params : {
                    query: p_name,
                    api_key: this.v_apiKey
                }
            }));
            return v_movies.data;
        } catch{
            throw new BadRequestException('Error during the process');
        }
    }

    async getById(p_id : number) : Promise<AxiosResponse<Movie[]>>{
        try{
            console.log('test ID');
            const v_movie = await firstValueFrom(this.s_httpService.get(`${this.v_apiUrl}/movie/${p_id}`,{
                params : {
                    api_key: this.v_apiKey
                }
            }));
            return v_movie.data
        } catch{
            throw new BadRequestException('Error during the process');
        }
    }

    async getGenre() : Promise<AxiosResponse<Movie[]>>{
        try{
            console.log('genre service');
            const v_genre = await firstValueFrom(this.s_httpService.get(`${this.v_apiUrl}/genre/movie/list?api_key=${this.v_apiKey}`));
            return v_genre.data;
        }
        catch{
            throw new BadRequestException('Error during the process');

        }
    }

    async getNowPlaying() : Promise<AxiosResponse<Movie[]>>{
        try{
            const v_url = `${this.v_apiUrl}/movie/now_playing`;
            const headers = {
                Authorization: `Bearer ${this.v_apiToken}`,
                Accept: 'application/json',
            };

            const v_movies = await firstValueFrom(
                this.s_httpService.get(v_url, { headers })
            );

            return v_movies.data
        } catch{
            throw new BadRequestException('Error during the process');
        }
    }
}

