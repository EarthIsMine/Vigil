import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { FrontendMevAttack } from '../detector/transform.service';
import { resolveAllowedOrigins } from '../common/cors';

@WebSocketGateway({
  cors: { origin: resolveAllowedOrigins() },
  namespace: '/events',
})
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
