import { Component } from '@angular/core';
import { InscriptionService } from 'src/app/services/inscription.service';
import { HttpHeaders } from '@angular/common/http';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';

@Component({
  selector: 'app-notificaion-rh',
  templateUrl: './notificaion-rh.component.html',
  styleUrls: ['./notificaion-rh.component.css']
})
export class NotificaionRhComponent {
  headers: any
  items: any
  notification: string[] = [];
  url: any
  shownb_consultants = false
  nb_demanades: any
  shownb_demanades = false
  nb_consultants: any
  lastnotifications: any
  constructor(private inscriptionservice: InscriptionService, private socketService: WebSocketService, private route: Router, private router: ActivatedRoute, private consultantService: ConsultantService) { }
  gotoallnotification() {
    this.route.navigate(['/consultant/allnotifications'])
  }
  ngOnInit(): void {
    this.consultantService.getlastnotificationsrh().subscribe({
      next: (res1) => {
        console.log(res1);
        this.lastnotifications = res1.slice(0, 10);
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

    this.url = this.router.url
    console.log(this.url._value[0].path);

    const token = localStorage.getItem('token');
    this.socketService.connect()
    // Listen for custom 'rhNotification' event in WebSocketService
    this.socketService.onRhNotification().subscribe((event: any) => {
      console.log();

      if (event.notification.toWho == "RH") {
        this.notification.push(event.notification.typeOfNotification)
      }

      // Handle your rhNotification event here
    });

    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.inscriptionservice.getvalidatedPreregisters(this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server

          console.log(res);
          if (this.url._value[0].path == 'allConsultants') {
            this.shownb_consultants = true
            this.nb_consultants = res.length
          }







        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
      this.inscriptionservice.getPendingPreregisters(this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server

          console.log(res);

          this.items = res
          if (this.url._value[0].path == 'dashboard') {
            this.shownb_demanades = true
            this.nb_demanades = this.items.length
          }





        },
        error: (e) => {
          // Handle errors
          // You can handle different status codes here
          if (e.status === 404) {
            this.items = []
            if (this.url._value[0].path == 'dashboard') {
              this.shownb_demanades = true
              this.nb_demanades = this.items.length
            }

          }

          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }
  }
  gottoallConsultants() {
    this.route.navigate(['/dashboard'])
  }
}
