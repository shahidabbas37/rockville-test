import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hash;
    return this.userModel.create(createUserDto);
  }

  async findbyId(id: string) {
    return await this.userModel.findById({ _id: id });
  }

  async findbyEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    // Define an array of allowed fields
    const allowedFields = [
      'name',
      'address',
      'dob',
      'profileImage',
      'favCategories',
    ];

    // Filter the updateUserDto to include only allowed fields
    const filteredUpdate = Object.keys(updateUserDto)
      .filter((field) => allowedFields.includes(field))
      .reduce((obj, field) => {
        obj[field] = updateUserDto[field];
        return obj;
      }, {});

    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...filteredUpdate, _id: id },
      { new: true },
    );

    return user;
  }
}
