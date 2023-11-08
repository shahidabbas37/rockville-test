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
    const hasUserReviewed = movie.reviews.some(
      (review) => review.userName === data.userName,
    );
    if (hasUserReviewed) {
      return { message: 'User has already reviewed this movie' };
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
   * For listing recommanded movies we will use the movies with high rating ,latest upload
   * user age and user favourite categories
   */
  async listRecommandedMovies(page: number, limit: number, user) {
    const skipCount = (page - 1) * limit;

    // Calculate the user's age from the date of birth
    const userDob = user.dob;
    const today = new Date();
    const userAge = today.getFullYear() - userDob.getFullYear();
   
    // Define age-to-category mappings
    const ageCategoryMappings = {
      '5-15': 'Animated',
      '18-30': 'Action',
      '30+': 'Comedy',
    };

    // Determine the user's age group based on age mappings
    let userCategory = 'Action';
    for (const ageRange in ageCategoryMappings) {
      const [minAge, maxAge] = ageRange.split('-');
      if (
        (!minAge || userAge >= parseInt(minAge, 10)) &&
        (!maxAge || userAge <= parseInt(maxAge, 10))
      ) {
        userCategory = ageCategoryMappings[ageRange];
        break;
      }
    }

    // Get the user's favorite categories (if available)
    const userFavoriteCategories = user.favCategories || [];

    // Define the category filter based on age and favorite categories
    const categoryFilter = [...userFavoriteCategories, userCategory];

    console.log('Category Filter', categoryFilter);

    const movies = await this.movieModel
      .find({
        category: { $in: categoryFilter },
        rating: { $gt: 0 },
      })
      .sort({
        rating: -1,
        updatedAt: -1,
      })
      .skip(skipCount)
      .limit(limit);

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
