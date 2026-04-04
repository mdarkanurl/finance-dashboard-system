import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { type Request } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractAccessToken(request);

    if (!accessToken) {
      throw new UnauthorizedException('Access token is required');
    }

    const secret = this.configService.get<string>('JWT_SECRET_FOR_ACCESS_TOKEN');

    if(!secret) {
      throw new Error('JWT_SECRET_FOR_ACCESS_TOKEN is not defined in environment variables');
    }

    let payload: JwtPayload;

    try {
      payload = jwt.verify(accessToken, secret) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    // TODO use redis to increase performance
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId,
        status: 'active',
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists or is inactive');
    }

    request.user = {
      userId: user.id,
      userRole: user.role
    };
    return true;
  }

  private extractAccessToken(request: Request): string | null {
    const cookie = request.cookies['access_token'];

    if (!cookie) {
      return null;
    }

    return cookie;
  }
}
