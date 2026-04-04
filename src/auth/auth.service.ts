import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupZodSchemaDto } from './dto/signup.dto';
import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class AuthService {
    constructor(
    private prisma: PrismaService
  ) {}
    async signup(
        data: SignupZodSchemaDto
    ) {
        try {
            const hashPassword = await bcrypt.hash(data.password, 10);

            return await this.prisma.user.create({
                data: {
                    ...data,
                    password: hashPassword
                },
                select: {
                    id: true,
                    fullname: true,
                    email: true,
                }
            });
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === "P2002") {
                    throw new ConflictException('user already exists');
                }
            }
            throw error;
        }
    }
}
