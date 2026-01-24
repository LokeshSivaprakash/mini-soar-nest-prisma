import { JwtService } from '@nestjs/jwt';

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
 constructor(private prisma: PrismaService, private jwt: JwtService) {}


  async signup(name: string, email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const token = await this.jwt.signAsync({
  sub: user.id,
  email: user.email,
  role: user.role,
});

return { user, accessToken: token };

  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // JWT comes in next step (we’ll return a placeholder for now)
        const token = await this.jwt.signAsync({
  sub: user.id,
  email: user.email,
  role: user.role,
});

return {
  user: { id: user.id, name: user.name, email: user.email, role: user.role },
  accessToken: token,
};

      
    };
  }

