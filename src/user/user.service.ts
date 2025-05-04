import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  createUser({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    const user = this.userRepository.create({ username, email, password });
    return this.userRepository.save(user);
  }

  create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['cvs'] });
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['cvs'],
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ username }, { email }],
    });
}
}
