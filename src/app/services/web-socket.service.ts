import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  constructor(private socket: Socket) {}
  connect(): void {
    this.socket.connect();
  }

  sendMessage(message: any): void {
    this.socket.emit('message', message);
  }

  onMessage(): any {
    return this.socket.fromEvent('message');
  }

  disconnect(): void {
    this.socket.disconnect();
  }
  onRhNotification(): Observable<any> {
    return this.socket.fromEvent('rhNotification');
  }
}
