import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto, CreateReviewsDto } from './dto/create-movie.dto';
import { AuthGuardGuard } from 'src/auth-guard/auth-guard.guard';
import { UserService } from 'src/user/user.service';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly userService: UserService,
  ) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuardGuard)
  async addReview(
    @Req() req,
    @Res() res,
    @Param('id') id: string,
    @Body() createReviewsDto: CreateReviewsDto,
  ) {
    let movie = await this.moviesService.addReview(id, createReviewsDto);
    if (!movie)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Movie Not Found',
      });
    return res.status(HttpStatus.OK).json({
      message: 'review added',
      movie: movie,
    });
  }

  @Get()
  @UseGuards(AuthGuardGuard)
  async listRecommandedMovies(@Req() req, @Res() res) {
    const user = await this.userService.findbyId(req.user);
    if (!user)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Not Found',
      });

    let movies = await this.moviesService.listRecommandedMovies(
      user.favCategories,
    );
    return res.status(HttpStatus.OK).json({
      message: 'recommanded movies',
      movies: movies,
    });
  }

  @Get('categories')
  @UseGuards(AuthGuardGuard)
  async listCategories(@Req() req, @Res() res) {
    const categories = await this.moviesService.listCategories();
    return res.status(HttpStatus.OK).json({
      message: 'movies categories',
      categories: categories,
    });
  }

  @Get('list')
  @UseGuards(AuthGuardGuard)
  async listMovies(
    @Req() req,
    @Res() res,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    page = page || 1;
    limit = limit || 10;
    const movies = await this.moviesService.listMovies(page, limit);
    return res.status(HttpStatus.OK).json({
      message: 'movies list',
      movies: movies,
    });
  }
}
