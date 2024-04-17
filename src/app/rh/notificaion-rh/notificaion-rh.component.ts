import { Component } from '@angular/core';
import { InscriptionService } from 'src/app/services/inscription.service';
import { HttpHeaders } from '@angular/common/http';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
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
  nblastnotifications: any
  res: any
  token: any
  new_notif: any
  constructor(private inscriptionservice: InscriptionService, private datePipe: DatePipe, private userservice: UserService, private socketService: WebSocketService, private route: Router, private router: ActivatedRoute, private consultantService: ConsultantService) { }
  gotoallnotification() {
    this.route.navigate([clientName + '/consultant/allnotifications'])
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  markNotificationAsSeen(notification_id: any) {
    this.consultantService.markNotificationAsSeen(notification_id).subscribe({
      next: (res1) => {

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

  }
  gotovalidationmission(notification_id: any, _id: string) {
    this.markNotificationAsSeen(notification_id)
    this.route.navigate([clientName + 'mission/' + _id])
  }
  gotovalidationtjm(notification_id: any, _id: string) {
    this.markNotificationAsSeen(notification_id)
    this.route.navigate([clientName + '/validated-tjmrequests/' + _id])
  }
  gotovalidationpreregister(notification_id: any, _id: string) {
    this.markNotificationAsSeen(notification_id)
    this.route.navigate([clientName + '/validation/' + _id])
  }
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id')
    this.new_notif = localStorage.getItem('new_notif');

    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.userservice.getpersonalinfobyid(user_id).subscribe({


        next: (res) => {
          // Handle the response from the server
          this.res = res







        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }
    this.consultantService.getRhNotificationsnotseen().subscribe({
      next: (res1) => {
        this.nblastnotifications = res1.length
        this.lastnotifications = res1
        console.log(
          this.lastnotifications
        );


      },
      error: (e) => {
        this.nblastnotifications = 0
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

    this.url = this.router.url
    console.log(this.url._value[0].path);


    this.socketService.connect()
    // Listen for custom 'rhNotification' event in WebSocketService
    this.socketService.onRhNotification().subscribe((event: any) => {
      console.log(event);

      if (event.notification.toWho == "RH") {
        this.lastnotifications.push(event.notification.typeOfNotification)
        this.nblastnotifications = this.lastnotifications.length
        this.notification.push(event.notification.typeOfNotification)
        localStorage.setItem('new_notif', 'true');
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
    this.route.navigate([clientName + '/dashboard'])
  }
  gotovalidation(item: any) {

    if (item.status == "WAITINGCONTRACT") {
      this.route.navigate([clientName + '/validationmission/' + item._id + '/' + item.contractProcess])

    } else {
      this.route.navigate([clientName + '/validation/' + item._id])
    }

  }

  gotomyprofile() {
    this.route.navigate([clientName + '/edit-profil'])
  }
}
