import { Controller, Get, Res, Req, Headers, Sse, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';

interface User {
  id: number;
  isAdmin: boolean;
}

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
import { SseService } from './sse.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageEvent } from '@nestjs/common';

@ApiTags('SSE')
@ApiBearerAuth()
@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get('events')
  @ApiOperation({ summary: 'SSE stream for CV events' })
  @ApiResponse({ status: 200, description: 'Event stream established' })
  @UseGuards(JwtAuthGuard)
  async streamEvents(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    if (!req.user) {
        throw new Error('User is not defined in request');
    }
    const isAdmin: boolean = req.user?.isAdmin || false;
    const userId = req.user?.id;

    const subscription = this.sseService
      .getEventStream(userId, isAdmin)
      .subscribe({
        next: (event) => {
          res.write(`data: ${JSON.stringify(event)}\n\n`);
        },
        error: (err) => {
          console.error('SSE error:', err);
          res.end();
        },
      });

    req.on('close', () => {
      subscription.unsubscribe();
      res.end();
    });
  }

  @Sse('admin-events')
  @ApiOperation({ summary: 'Admin SSE stream (all events)' })
  @ApiResponse({ status: 200, description: 'Admin event stream established' })
  @UseGuards(JwtAuthGuard)
  streamAdminEvents(@Req() req: Request): Observable<MessageEvent> {
    if (!req.user?.isAdmin) {
      throw new ForbiddenException('Only admins can access this stream');
    }
    return this.sseService.getAdminEventStream();
  }
}