import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  address: string;

  @Prop()
  profileImage: string;

  @Prop()
  dob: Date;

  @Prop([String])
  favCategories: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
