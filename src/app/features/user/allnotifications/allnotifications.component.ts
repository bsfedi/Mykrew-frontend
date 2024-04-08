import { ConsultantService } from 'src/app/services/consultant.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;

@Component({
  selector: 'app-allnotifications',
  templateUrl: './allnotifications.component.html',
  styleUrls: ['./allnotifications.component.css']
})
export class AllnotificationsComponent {
  notification: any[] = [];
  lastnotifications: any;
  role: any
  show: any
  pageSize = 15; // Number of items per page
  currentPage = 1; // Current page
  totalPages: any;
  res: any
  constructor(private socketService: WebSocketService, private consultantservice: ConsultantService, private userservice: UserService, private router: Router, private datePipe: DatePipe) { }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');
    localStorage.setItem('new_notif', 'false')

    this.role = localStorage.getItem('role')

    if (this.role == 'ADMIN' || this.role == 'RH') {
      this.consultantservice.getlastnotificationsrh().subscribe({
        next: (res1) => {
          this.show = true
          this.lastnotifications = res1;
          this.totalPages = Math.ceil(this.lastnotifications.length / this.pageSize);


        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    } else {
      this.consultantservice.getallnotification(user_id).subscribe({
        next: (res1) => {
          this.show = true
          this.lastnotifications = res1
          this.totalPages = Math.ceil(this.lastnotifications.length / this.pageSize);

        },
        error: (e) => {

          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }
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
    // Connect to Socket.IO server
    this.socketService.connect();

    // Listen for incoming messages
    this.socketService.onMessage().subscribe((message: any) => {
      console.log('Received message:', message);
      // Handle your Socket.IO messages here
    });

    // Listen for custom 'rhNotification' event in WebSocketService
    this.socketService.onRhNotification().subscribe((event: any) => {
      console.log('Received rhNotification event:', event);
      if (event.notification.toWho == "CONSULTANT") {
        this.lastnotifications.push(event.notification)


      }

      // Handle your rhNotification event here
    });

  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getDisplayedNotifications(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.lastnotifications.length);
    return this.lastnotifications.slice(startIndex, endIndex);
  }
  markNotificationAsSeen(notification_id: any) {
    this.consultantservice.markNotificationAsSeen(notification_id).subscribe({
      next: (res1) => {

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

  }
  ngOnDestroy(): void {
    // Disconnect from Socket.IO server when the component is destroyed
    this.socketService.disconnect();
  }

  sendMessage(): void {
    // Send a sample message to the Socket.IO server
    this.socketService.sendMessage({ content: 'Hello, Socket.IO!' });
  }
  gotovalidation(notification_id: any, _id: string) {
    this.markNotificationAsSeen(notification_id)
    this.router.navigate([clientName + '/mission/' + _id])
  }
  detailsmission(notification_id: any, _id: string) {
    this.markNotificationAsSeen(notification_id)
    this.router.navigate([clientName + '/consultant/details-mission/' + _id])
  }


  gotovalidationtjm(notification_id: any, _id: string) {
    this.markNotificationAsSeen(notification_id)
    this.router.navigate([clientName + '/validated-tjmrequests/' + _id])
  }
  gotovalidationpreregister(notification_id: any, _id: string) {
    this.markNotificationAsSeen(notification_id)
    this.router.navigate([clientName + '/validation/' + _id])
  }
}
