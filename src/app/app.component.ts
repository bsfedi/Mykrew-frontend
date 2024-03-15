import { Component } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mykrew';
  constructor(private datePipe: DatePipe) {
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
}
