import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification : any[]= [];
  lastnotifications : any;
  lastnotificationsvir : any;
  constructor(private socketService: WebSocketService, private consultantservice :ConsultantService,private router : Router ) {}

  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');
    this.consultantservice.getlastnotifications(user_id).subscribe({
      next: (res1) => {
        console.log(res1);
        this.lastnotifications =res1
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
        this.lastnotificationsvir =res1
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
    if (event.notification.toWho == "CONSULTANT"){
      
      if (event.notification.typeOfNotification == 'VIREMENT' ){
        this.lastnotificationsvir.push(event.notification)
      }else{
        this.lastnotifications.push(event.notification)
      }
      
    }
    
    // Handle your rhNotification event here
  });
  }

  ngOnDestroy(): void {
    // Disconnect from Socket.IO server when the component is destroyed
    this.socketService.disconnect();
  }

  gotoallnotification(){
    this.router.navigate(['/consultant/allnotifications'])
  }

  sendMessage(): void {
    // Send a sample message to the Socket.IO server
    this.socketService.sendMessage({ content: 'Hello, Socket.IO!' });
  }
}
