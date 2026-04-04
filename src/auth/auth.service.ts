import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupZodSchemaDto } from './dto/signup.dto';
import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { SigninZodSchemaDto } from './dto/signin.dto';
import jwt from "jsonwebtoken";
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

    async signup(
        data: SignupZodSchemaDto
    ): Promise<{ id: string, fullname: string, email: string }> {
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

    private signJwtAccessToken(
        payload: { userId: string, userRole: Role }
    ): string {
        const JWT_SECRET = this.configService
            .get<string>('JWT_SECRET_FOR_ACCESS_TOKEN');

        if(!JWT_SECRET) {
            throw new Error('JWT_SECRET_FOR_REFRESH_TOKEN is not defined in environment variables');
        }
            
        return jwt.sign(
            payload,
            JWT_SECRET,
           { expiresIn: '15m'},
        );
    }

    private signJwtRefreshToken(
        payload: { userId: string, userRole: Role }
    ): string {
        const JWT_SECRET = this.configService
            .get<string>('JWT_SECRET_FOR_REFRESH_TOKEN');

        if(!JWT_SECRET) {
            throw new Error('JWT_SECRET_FOR_REFRESH_TOKEN is not defined in environment variables');
        }
            
        return jwt.sign(
            payload,
            JWT_SECRET,
           { expiresIn: '30d'},
        );
    }

    async signin(
        data: SigninZodSchemaDto
    ): Promise<{ accessToken: string, refreshToken: string }> {

        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: data.email,
                    status: "active"
                },
                select: {
                    id: true,
                    password: true,
                    role: true,
                }
            });

            if(!user) {
                throw new NotFoundException('invalid credentials');
            }

            const isPasswordMatch = await bcrypt.compare(data.password, user.password);

            if(!isPasswordMatch) {
                throw new BadRequestException('invalid credentials');
            }

            const accessToken = this.signJwtAccessToken({
                userId: user.id,
                userRole: user.role
            });

            const refreshToken = this.signJwtRefreshToken({
                userId: user.id,
                userRole: user.role
            });

            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw error;
        }
    }
}
