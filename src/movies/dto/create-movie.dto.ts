import { IsString, IsEnum, IsNumber, Min, Max, IsArray } from 'class-validator';
import { MovieCategory } from '../schemas/movie.schema';

export class CreateMovieDto {
  @IsString()
  name: string;

  @IsString()
  actor: string;

  @IsEnum(MovieCategory)
  category: MovieCategory;

  @IsNumber()
  rating: number;

  @IsArray()
  reviews:CreateReviewsDto[]
}


export class CreateReviewsDto {
  @IsString()
  userName: string;

  @IsString()
  text: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  stars: number;
}
