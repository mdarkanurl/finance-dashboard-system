import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { signupZodSchema, type SignupZodSchemaDto } from './dto/signup.dto';
import { signinZodSchema, type SigninZodSchemaDto } from './dto/signin.dto';
import { Public } from './decorators/public.decorator';

@Controller({ path: "auth", version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body(new ZodValidationPipe(signupZodSchema))
    body: SignupZodSchemaDto
  ) {
    try {
      const user = await this.authService.signup(body);

      return {
        success: true,
        message: "user created successfully",
        data: user,
        error: null
      }
    } catch (error) {
      throw error instanceof HttpException
      ? error
      : new InternalServerErrorException('Failed to create user');
    }
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Res({ passthrough: true }) res: Response,
    @Body(new ZodValidationPipe(signinZodSchema))
    body: SigninZodSchemaDto
  ) {
    try {
      const token = await this.authService.signin(body);

      // Set token in cookie
      res.cookie('access_token', token.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60000 * 15, // minutes
      });

      res.cookie('refresh_token', token.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000 * 24 * 30, // 1 month
      });

      return {
        success: true,
        message: "Logged in successfully",
        data: null,
        error: null
      }
    } catch (error) {
      throw error instanceof HttpException
      ? error
      : new InternalServerErrorException('Failed to create user');
    }
  }
}
