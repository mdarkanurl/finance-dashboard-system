import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { signupZodSchema, type SignupZodSchemaDto } from './dto/signup.dto';

@Controller({ path: "auth", version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
