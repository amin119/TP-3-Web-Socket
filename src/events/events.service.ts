import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async logEvent(type: string, userId: number, cvId?: number, details?: any): Promise<Event> {
    const event = this.eventRepository.create({
      type,
      userId,
      cvId,
      details,
      timestamp: new Date(),
    });
    return this.eventRepository.save(event);
  }

  async getEventsForUser(userId: number): Promise<Event[]> {
    return this.eventRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
    });
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async getCvEvents(cvId: number): Promise<Event[]> {
    return this.eventRepository.find({
      where: { cvId },
      order: { timestamp: 'DESC' },
    });
  }

  async getEventById(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }
}