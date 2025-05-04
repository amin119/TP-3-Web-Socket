import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.userId;
    } catch (e) {
      client.disconnect();
    }
  }
}