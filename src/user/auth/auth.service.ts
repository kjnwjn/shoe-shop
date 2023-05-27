import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignInDto, SignupDto } from '../dtos/auth.dto';
import { Role } from '@prisma/client';
interface SignupParams {
  name: string;
  email: string;
  password: string;
}
interface SignInParams {
  email: string;
  password: string;
}
@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({ email, password, name }: SignupParams) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExist) throw new ConflictException();
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const user = await this.prismaService.user.create({
      data: { email, password: hash, name },
    });
    if (!user) throw new InternalServerErrorException();

    return this.generateToken(email, user.id, user.role);
  }

  async signIn({ email, password }: SignInParams) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!userExist) throw new ConflictException();
    const isUserExist = await bcrypt.compare(password, userExist.password);
    if (!isUserExist) throw new HttpException('Invalid credentials', 400);

    return this.generateToken(email, userExist.id, userExist.role);
  }
  private generateToken(email: String, id: Number, role: Role) {
    return jwt.sign({ email, id, role }, process.env.TOKEN, {
      expiresIn: '10d',
    });
  }
}
