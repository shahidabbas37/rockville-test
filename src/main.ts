import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MoviesService } from './movies/movies.service';
import  { moviesData } from './seeders/seed-data';
import { PORT } from './config';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // seeding data
//const moviesService = app.get(MoviesService);
// await moviesService.seedData(moviesData);
  await app.listen(PORT || 3000);
}
bootstrap();
