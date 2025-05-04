import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { MessageEvent } from '@nestjs/common';

@Injectable()
export class SseService {
  constructor(private eventEmitter: EventEmitter2) {}

  /**
   * Get event stream for regular users (filtered by user ID) or admins (all events)
   * @param userId The ID of the current user
   * @param isAdmin Whether the user is an admin
   */
  getEventStream(userId: number, isAdmin: boolean): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'cv.event').pipe(
      filter((event: { type: string; userId: number; cvId?: number }) => {
        // Admin gets all events, regular users only get their own events
        return isAdmin || event.userId === userId;
      }),
      map(this.formatEvent)
    );
  }

  /**
   * Get unfiltered event stream for admin users only
   */
  getAdminEventStream(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'cv.event').pipe(
      map(this.formatEvent)
    );
  }


  private formatEvent(event: { type: string; userId: number; cvId?: number }): MessageEvent {
    return {
      type: event.type,
      data: {
        eventType: event.type,
        userId: event.userId,
        cvId: event.cvId,
        timestamp: new Date().toISOString(),
      },
    };
  }


  emitEvent(event: { type: string; userId: number; cvId?: number }) {
    this.eventEmitter.emit('cv.event', event);
  }
}