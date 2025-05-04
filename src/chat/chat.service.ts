import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/message.entity';
import { User } from '../user/entities/user.entity';


@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createMessage(userId: number, content: string): Promise<Message> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const message = this.messageRepository.create({
      content,
      user,
      reactions: {},
      comments: [],
    });

    return this.messageRepository.save(message);
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async addReaction(
    messageId: number,
    emoji: string,
    userId: number,
  ): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['user'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.reactions = message.reactions || {};
    message.reactions[emoji] = (message.reactions[emoji] || 0) + 1;

    return this.messageRepository.save(message);
  }

  async addComment(
    messageId: number,
    comment: string,
    userId: number,
  ): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['user'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!message || !user) {
      throw new NotFoundException('Message or user not found');
    }

    message.comments = message.comments || [];
    message.comments.push({
      userId,
      username: user.username,
      content: comment,
      timestamp: new Date(),
    });

    return this.messageRepository.save(message);
  }

  async getMessageById(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }
}