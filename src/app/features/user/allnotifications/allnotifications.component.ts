import { ConsultantService } from 'src/app/services/consultant.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-allnotifications',
  templateUrl: './allnotifications.component.html',
  styleUrls: ['./allnotifications.component.css']
})
export class AllnotificationsComponent {
  notification : any[]= [];
  lastnotifications : any;
  constructor(private socketService: WebSocketService, private consultantservice :ConsultantService) {}

  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');
    this.consultantservice.getallnotification(user_id).subscribe({
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
      this.lastnotifications.push(event.notification)
      for(let ee of this.notification){
        
        
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
}
