import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

export enum MovieCategory {
  Action = 'Action',
  Horror = 'Horror',
  Comedy = 'Comedy',
  Animated = 'Animated',
}

@Schema({ timestamps: true })
export class Movie {
  @Prop()
  name: string;

  @Prop()
  actor: string;

  @Prop({
    type: String,
    enum: Object.values(MovieCategory),
  })
  category: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({default:[]})
  reviews: {
    userName: string; 
    text: string;
    stars: number;
  }[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
