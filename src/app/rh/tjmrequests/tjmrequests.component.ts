import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-tjmrequests',
  templateUrl: './tjmrequests.component.html',
  styleUrls: ['./tjmrequests.component.css']
})
export class TjmrequestsComponent {
  token: any
  headers: any
  user_id: any
  tjmrequests: any
  formData: { typeVirement: string; montant: string } = { typeVirement: '', montant: '' };
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = []
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  notification: string[] = [];
  res: any
  shownotiff: boolean = false
  pending_missions: any
  tjm: boolean = true
  mission: any
  constructor(private consultantservice: ConsultantService, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private userservice: UserService, private socketService: WebSocketService) { }

  shownotif() {

    this.shownotiff = !this.shownotiff
  }
  pageSize = 0; // Number of items per page
  currentPagemission = 1; // Current page
  currentPagetjm = 1; // Current page
  totalPages: any;
  getDisplayeddocs(): any[] {
    this.pageSize = 8

    if (this.mission) {

      this.totalPages = Math.ceil(this.pending_missions.length / this.pageSize);
      const startIndex = (this.currentPagemission - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.pending_missions.length);

      return this.pending_missions.slice(startIndex, endIndex);
    } else {
      this.totalPages = Math.ceil(this.tjmrequests.length / this.pageSize);
      const startIndex = (this.currentPagetjm - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.tjmrequests.length);
      return this.tjmrequests.slice(startIndex, endIndex);
    }

  }
  nextPage() {
    if (this.currentPagemission < this.totalPages) {
      this.currentPagemission++;
    }
  }

  previousPage() {
    if (this.currentPagemission > 1) {
      this.currentPagemission--;
    }
  }
  nextPagetjm() {
    if (this.currentPagetjm < this.totalPages) {
      this.currentPagetjm++;
    }
  }

  previousPageyjm() {
    if (this.currentPagetjm > 1) {
      this.currentPagetjm--;
    }
  }

  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id')
    this.new_notif = localStorage.getItem('new_notif');

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
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.consultantservice.getAllPendingMissions(this.headers).subscribe({


        next: (res) => {


          const latestStartDate = new Date(
            Math.max(
              ...res.map((mission: any) =>
                new Date(mission.missionInfo.startDate.value).getTime()
              )
            )
          );

          this.pending_missions = res.map((mission: any) => {
            const missionStartDate = new Date(mission.missionInfo.startDate.value);

            // Compare the mission start date with the latest start date
            if (missionStartDate.getTime() === latestStartDate.getTime()) {
              // If the mission start date is the latest, set status to "nouvelle"
              mission.status = "nouvelle";
            } else {
              // If the mission start date is not the latest, set status to "ancienne"
              mission.status = "ancienne";
            }

            return mission;
          });
          console.log(this.pending_missions);

        },
        error: (e) => {
          // Handle errors
          this.pending_missions = []
          console.error(e);
          // Set loading to false in case of an error
        }
      });
      this.consultantservice.getRhNotificationsnotseen().subscribe({
        next: (res1) => {
          this.nblastnotifications = res1.length
          this.lastnotifications = res1

        },
        error: (e) => {
          this.nblastnotifications = 0
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

    this.token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `${this.token}`);

    this.consultantservice.getAllTjmRequest().subscribe(
      (response) => {
        this.tjmrequests = response
        console.log(this.tjmrequests);

        // Add any additional handling or notifications if needed
      },
      (error) => {
        this.tjmrequests = []
        console.error('Error getting virement:', error);
        // Handle the error or display an error message
      }
    );
  }
  showtjm() {
    this.tjm = true
    this.mission = false
  }
  showmission() {
    this.tjm = false
    this.mission = true
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/validated-tjmrequests/' + _id])
  }
  gotovalidationmission(_id: string) {
    this.router.navigate([clientName + '/mission/' + _id])
  }
  gotovalidemission(mission_id: any, id: any) {
    this.router.navigate([clientName + '/validationmission/' + mission_id + '/' + id])
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  onFormSubmit() {

    const formData = {
      // Extract form data as needed (e.g., fullName, companyName)
      // Example:


      userId: this.user_id,
      typeVirement: this.formData.typeVirement,
      montant: this.formData.montant,
      // Add other form data here
    };

    this.consultantservice.createvirement(formData).subscribe(
      (response) => {
        console.log('Virement created successfully:', response);
        // Add any additional handling or notifications if needed
      },
      (error) => {
        console.error('Error creating virement:', error);
        // Handle the error or display an error message
      }
    );
  }
}
