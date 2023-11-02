import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DB_URL } from './config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    })
    ,
    MongooseModule.forRoot(DB_URL),
    MoviesModule,
    UserModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
