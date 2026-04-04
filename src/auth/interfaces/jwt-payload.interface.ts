import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  userRole: Role;
  iat?: number;
  exp?: number;
}
