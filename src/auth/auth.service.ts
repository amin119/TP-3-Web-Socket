import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.usersService.findByUsernameOrEmail(
      dto.username,
      dto.email,
    );
    if (userExists) {
      throw new ConflictException('Username or email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const { username, email } = dto;
    const user = await this.usersService.create({
      username,
      email,
      password: hashedPassword,
      salt,
      role: 'user',
    });

    const { password: _, salt: __, ...result } = user;
    return result;
  }

  async login(credentials: LoginDto) {
    const { username, password } = credentials;

    const user = await this.usersService.findByUsername(credentials.username);
    if (!user) throw new NotFoundException('Invalid credentials');

    const isValid = await bcrypt.compare(credentials.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const jwt = await this.jwtService.sign(payload);

    return {
      access_token: jwt,
    };
  }
}
