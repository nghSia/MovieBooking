import { Controller, Get, HttpException, HttpStatus, Query, Res } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';
import { Movie } from 'src/interfaces/movie.interface';

@Controller('movies')
export class MoviesController {

    constructor(
        private s_movieService : MoviesService
    ){}

    @Get('find/:name')
    @ApiOperation({ summary: 'rechercher films par mot cles' })
    @ApiResponse({ status: 201, description: 'film trouve' })
    @ApiResponse({ status: 400, description: 'Erreurs lors de la recuperation, informations invalides' })
    async getMovies(@Query('title') p_title: string): Promise<AxiosResponse<Movie[]>> {
        return this.s_movieService.getByName(p_title);
    }

    @Get('findby/:id')
    @ApiOperation({ summary: 'rechercher films par son Id' })
    @ApiResponse({ status: 201, description: 'film trouve' })
    @ApiResponse({ status: 400, description: 'Erreurs lors de la recuperation, informations invalides' })
    async getFilmById(@Query('id') p_id: number): Promise<AxiosResponse<Movie[]>> {
        console.log('🎬 Requête reçue dans MoviesController /movies/ID');
        return this.s_movieService.getById(p_id);
    }

    @Get('genre/list')
    @ApiOperation({ summary: 'lister tous les genres de films' })
    @ApiResponse({ status: 201, description: 'genres trouve' })
    @ApiResponse({ status: 400, description: 'Erreurs lors de la recuperation, informations invalides' })
    async getAllgenre(): Promise<AxiosResponse<Movie[]>> {
        console.log("genre");
        return this.s_movieService.getGenre();
    }

    @Get('now_playing')
    @ApiOperation({ summary: 'lister tous les genres de films du moment' })
    @ApiResponse({ status: 201, description: 'films du moments trouve' })
    @ApiResponse({ status: 400, description: 'Erreurs lors de la recuperation, informations invalides' })
    async getAllNowPlaying(): Promise<AxiosResponse<Movie[]>> {
        return this.s_movieService.getNowPlaying();
    }

}
