import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: any[] = [];
  lastnotifications: any;
  lastnotificationsvir: any;
  res: any
  constructor(private socketService: WebSocketService, private consultantservice: ConsultantService, private userservice: UserService, private router: Router, private datePipe: DatePipe) { }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');


    localStorage.setItem('new_notif', 'false')

    this.userservice.getpersonalinfobyid(user_id).subscribe({


      next: (res) => {
        // Handle the response from the server
        this.res = res
        console.log('inffffffffoooooo', this.res);






      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

    this.consultantservice.getlastnotifications(user_id).subscribe({
      next: (res1) => {
        console.log(res1);
        this.lastnotifications = res1
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    this.consultantservice.getlastvirementnotification(user_id).subscribe({
      next: (res1) => {
        console.log(res1);
        this.lastnotificationsvir = res1
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

    // Connect to Socket.IO server
    this.socketService.connect();

    // Listen for incoming messages
    this.socketService.onMessage().subscribe((message: any) => {
      console.log('Received message:', message);
      // Handle your Socket.IO messages here
    });

    // Listen for custom 'rhNotification' event in WebSocketService
    this.socketService.onRhNotification().subscribe((event: any) => {
      localStorage.setItem('new_notif', 'true');
      console.log('Received rhNotification event:', event);
      if (event.notification.toWho == "CONSULTANT") {

        if (event.notification.typeOfNotification == 'VIREMENT') {
          this.lastnotificationsvir.push(event.notification)
        }

      }

      // Handle your rhNotification event here
    });
  }

  ngOnDestroy(): void {
    // Disconnect from Socket.IO server when the component is destroyed
    this.socketService.disconnect();
  }

  gotoallnotification() {
    this.router.navigate([clientName + '/consultant/allnotifications'])
  }

  sendMessage(): void {
    // Send a sample message to the Socket.IO server
    this.socketService.sendMessage({ content: 'Hello, Socket.IO!' });
  }
}
