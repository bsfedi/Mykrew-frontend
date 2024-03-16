import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';
declare const PDFObject: any;

import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
const baseUrl = `${environment.baseUrl}`;

@Component({
  selector: 'app-validated-tjm',
  templateUrl: './validated-tjm.component.html',
  styleUrls: ['./validated-tjm.component.css']
})
export class ValidatedTjmComponent {
  mission_id: any
  headers: any
  clientInfo: any
  missionInfo: any
  status: any
  pdfData: any
  item: any;
  myForm: FormGroup;
  new_tjm: any
  pdfData1: any
  showpdf: any
  showpdf1: any
  res: any
  notification: string[] = [];
  lastnotifications: any
  constructor(private consultantservice: ConsultantService, private inscriptionservice: InscriptionService, private socketService: WebSocketService, private userservice: UserService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.myForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      location: ['', Validators.required],
      nationality: ['', Validators.required],
      socialSecurityNumber: ['', Validators.required],
      identificationDocument: ['', Validators.required],
      rib: ['', Validators.required],
      hasCar: [true, Validators.required],
      drivingLicense: ['', Validators.required],
      company: ['', Validators.required],
      clientfirstName: ['', Validators.required],
      clientlastName: ['', Validators.required],
      clientPostion: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientphoneNumber: ['', Validators.required],
      profession: ['', Validators.required],
      industrySector: ['', Validators.required],
      finalClient: ['', Validators.required],
      dailyRate: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      simulationValidation: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.mission_id = params['id'];
    });

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

    this.consultantservice.getlastnotificationsrh().subscribe({
      next: (res1) => {
        console.log(res1);
        this.lastnotifications = res1.slice(0, 10);
        for (let item of this.lastnotifications) {
          //getuserinfomation
          this.consultantservice.getuserinfomation(item["userId"], this.headers).subscribe({
            next: (info) => {
              console.log(info);

              item["userId"] = info["firstName"] + ' ' + info["lastName"]
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
    this.socketService.connect()
    // Listen for custom 'rhNotification' event in WebSocketService
    this.socketService.onRhNotification().subscribe((event: any) => {
      console.log(event);

      if (event.notification.toWho == "RH") {
        this.lastnotifications.push(event.notification.typeOfNotification)
        this.notification.push(event.notification.typeOfNotification)
      }

      // Handle your rhNotification event here
    });
    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.consultantservice.getUserMissionById(this.mission_id, this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.status = res.newMissionStatus


          this.clientInfo = res.clientInfo;
          this.missionInfo = res.missionInfo
          if (this.missionInfo.isSimulationValidated.endsWith('.pdf')) {
            this.inscriptionservice.getPdf(baseUrl + "uploads/" + this.missionInfo.isSimulationValidated).subscribe({
              next: (res) => {
                this.showpdf = true
                this.pdfData = res;

                if (this.pdfData) {
                  this.handleRenderPdf(this.pdfData);
                }
              },
            });
          } else {
            this.showpdf = false
            this.item.missionInfo.isSimulationValidated = baseUrl + "uploads/" + this.item.missionInfo.isSimulationValidated


          }


        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
      this.consultantservice.getTjmRequestsByMissionId(this.mission_id).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.new_tjm = res
          console.log(this.new_tjm.simulationValidated);



          if (this.new_tjm.simulationValidated.endsWith('.pdf')) {
            this.inscriptionservice.getPdf(baseUrl + "uploads/" + this.new_tjm.simulationValidated).subscribe({
              next: (res) => {
                this.showpdf1 = true
                this.pdfData1 = res;

                if (this.pdfData1) {
                  this.handleRenderPdf1(this.pdfData1);
                }
              },
            });
          } else {
            this.showpdf1 = false
            this.new_tjm.simulationValidated = baseUrl + "uploads/" + this.new_tjm.simulationValidated
            console.log(this.new_tjm.simulationValidated);

          }

        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });

    }
  }
  handleRenderPdf(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer');

  }
  handleRenderPdf1(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer1');

  }
  valid() {
    this.consultantservice.rhTjmValidation(this.new_tjm._id, {
      "response": true

    }).subscribe({
      next: (res) => {
        // Handle success
        console.log(res);
        Swal.fire({
          title: 'TJM Validé',
          text: 'Le Tarif Journalier Moyen a été validé avec succès !',
          icon: 'success'
        });
        this.router.navigate(['/tjmrequests'])
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  invalid() {
    this.consultantservice.rhTjmValidation(this.new_tjm._id, {
      "response": false

    }).subscribe({
      next: (res) => {
        // Handle success
        console.log(res);
        Swal.fire({
          title: 'TJM Invalidé',
          text: 'Le Tarif Journalier Moyen a été invalidé.',
          icon: 'error'
        });
        this.router.navigate(['/tjmrequests'])
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
}
