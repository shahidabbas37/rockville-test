import { Injectable } from '@nestjs/common';
import { CreateMovieDto, CreateReviewsDto } from './dto/create-movie.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema';
import { UserDocument } from 'src/user/schemas/user.schemas';
import { Model } from 'mongoose';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<UserDocument>,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    return this.movieModel.create(createMovieDto);
  }

  async addReview(id: string, data: CreateReviewsDto) {
    let movie: any = await this.movieModel.findById({ _id: id });
    if (!movie) return null;

    // Check if the user has already reviewed the movie
  const hasUserReviewed = movie.reviews.some((review) => review.userName === data.userName);
  if (hasUserReviewed) {
    return { message: "User has already reviewed this movie" };
  }

    // Calculate the new average rating
    const existingRatings = movie.reviews.map((review) => review.stars);
    const newTotalRatings = [...existingRatings, data.stars];
    let newAverageRating =
      newTotalRatings.reduce((acc, curr) => acc + curr, 0) /
      newTotalRatings.length;

    newAverageRating = Number(newAverageRating.toFixed(1));

    movie.reviews.push({
      userName: data.userName,
      text: data.text,
      stars: data.stars,
    });

    movie.rating = newAverageRating;

    return await movie.save();
  }

  /**
   * 
   * For listing recommanded movies we will use the movies with high rating & latest upload
   */
  async listRecommandedMovies() {
    const movies = await this.movieModel.find({
      rating: { $gt: 0 }, 
    }).sort({
      rating: -1,      
      updatedAt: -1,    
    }).limit(10);    

    return movies;
  }

  async listCategories() {
    const categories = await this.movieModel.distinct('category');
    return categories;
  }

  async listMovies(page: number, limit: number) {
    const skipCount = (page - 1) * limit;
    const movies = await this.movieModel.find().skip(skipCount).limit(limit);
    return movies;
  }

  async seedData(seedData) {
    await this.movieModel.deleteMany({});
    await this.movieModel.insertMany(seedData);
  }
}
