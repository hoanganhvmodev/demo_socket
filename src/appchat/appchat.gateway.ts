import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Message } from './appchat.entity';
import { AppchatService } from './appchat.service';

@WebSocketGateway()
export class AppchatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly appchatService: AppchatService) {}

  @WebSocketServer()
  private wss: Server;

  private logger: Logger = new Logger('MessageGateway');
  private count = 0;

  async handleConnection(client: any, ...args: any[]) {
    this.count += 1;
    this.logger.log(`Connected: ${this.count} connection`);
    const messages: Message[] = await this.appchatService.getAll();
    client.emit('all-message-to-client', messages);
  }

  handleDisconnect(client: any) {
    this.count -= 1;
    this.logger.log(`Disconnected: ${this.count} connection`);
  }

  afterInit(server: any) {
    this.logger.log('MessageGateway initialized');
  }

  @SubscribeMessage('new-message-to-server')
  async handleNewMessage(@MessageBody() data: { sender: string; message: string }): Promise<void> {
    const message = await this.appchatService.createMessage(data.sender, data.message);
    this.wss.emit('new-message-to-client', {message});
  }
}
