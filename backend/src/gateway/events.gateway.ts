import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { FrontendMevAttack } from '../detector/transform.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/events' })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  broadcastAttack(attack: FrontendMevAttack) {
    this.server?.emit('new_attack', attack);
  }

  broadcastStatsUpdate(stats: any) {
    this.server?.emit('stats_update', stats);
  }
}
