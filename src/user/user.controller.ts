import {
  Controller,
  Post,
  Body,
  Patch,
  HttpStatus,
  Res,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserDocument } from './schemas/user.schemas';
import { AuthGuardGuard } from 'src/auth-guard/auth-guard.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/multer-config';
import { JWT_EXPIRY, JWT_SECRET_KEY } from 'src/config';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Res() response, @Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findbyEmail(createUserDto.email);
    if (user)
      return response.status(HttpStatus.CONFLICT).json({
        message: 'User with email already exists',
      });

    await this.userService.create(createUserDto);
    return response.status(HttpStatus.CREATED).json({
      message: 'User has been created',
    });
  }

  @Post('login')
  async login(
    @Res() response,
    @Body() LoginUserDto: LoginUserDto,
  ): Promise<UserDocument> {
    const user = await this.userService.findbyEmail(LoginUserDto.email);
    if (!user)
      return response.status(HttpStatus.NOT_FOUND).json({
        message: 'User Not Found',
      });

    const passwordMatch = await bcrypt.compare(
      LoginUserDto.password,
      user.password,
    );
    if (!passwordMatch)
      return response.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid credentials',
      });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRY });

    const { password, ...others } = user.toObject();
    return response.status(HttpStatus.OK).json({
      message: 'Login Successful',
      user: others,
      token: token,
    });
  }

  @Patch('password')
  @UseGuards(AuthGuardGuard)
  async changePassword(
    @Res() response,
    @Req() req,
    @Body() ChangePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.userService.findbyId(req.user);
    if (!user)
      return response.status(HttpStatus.NOT_FOUND).json({
        message: 'User Not Found',
      });

    const passwordMatch = await bcrypt.compare(
      ChangePasswordDto.previousPassword,
      user.password,
    );

    if (!passwordMatch)
      return response.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid previous password',
      });

    const hash = await bcrypt.hash(ChangePasswordDto.newPassword, 10);
    user.password = hash;
    await user.save();
    return response.status(HttpStatus.OK).json({
      message: 'Password has been changed',
    });
  }

  @Patch('update-profile')
  @UseGuards(AuthGuardGuard)
  async update(@Req() req, @Res() res, @Body() updateUserDto: UpdateUserDto) {
    let user = await this.userService.update(req.user, updateUserDto);
    if (!user)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'user not found',
      });
    user.password = undefined;
    return res.status(HttpStatus.OK).json({
      message: 'profile has been updated',
      user: user,
    });
  }

  @Patch('upload-profile')
  @UseGuards(AuthGuardGuard)
  @UseInterceptors(
    FileInterceptor(
      'file', // name of the field being passed
      { storage },
    ),
  )
  async uploadProfile(@Req() req, @Res() res, @UploadedFile() file) {
    let user = await this.userService.findbyId(req.user);
    if (!user)
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'user not found',
      });
    user.profileImage = file.path;
    await user.save();
    user.password = undefined;

    return res.status(HttpStatus.OK).json({
      message: 'profile image has been updated',
      user: user,
    });
  }
}
