import { ConsultantService } from 'src/app/services/consultant.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-allnotifications',
  templateUrl: './allnotifications.component.html',
  styleUrls: ['./allnotifications.component.css']
})
export class AllnotificationsComponent {
  notification: any[] = [];
  lastnotifications: any;
  role: any
  constructor(private socketService: WebSocketService, private consultantservice: ConsultantService, private router: Router, private datePipe: DatePipe) { }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');
    this.role = localStorage.getItem('role')

    if (this.role == 'ADMIN' || this.role == 'RH') {
      this.consultantservice.getlastnotificationsrh().subscribe({
        next: (res1) => {

          this.lastnotifications = res1;
          console.log(this.lastnotifications);
          for (let item of this.lastnotifications) {
            //getuserinfomation
            this.consultantservice.getuserinfomation(item["userId"]).subscribe({
              next: (info) => {
                console.log(info);

                item["userId"] = info["firstName"] + ' ' + info["lastName"]
              }, error: (e) => {
                // Handle errors
                console.error(e);
                item["userId"] = ""
                // Set loading to false in case of an error

              }
            })
          }

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
          console.log(res1);
          this.lastnotifications = res1

        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }

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
        for (let ee of this.notification) {


        }

      }

      // Handle your rhNotification event here
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
  gotovalidation(_id: string) {
    this.router.navigate(['mission/' + _id])
  }
  gotovalidationtjm(_id: string) {
    this.router.navigate(['/validated-tjmrequests/' + _id])
  }
}
