import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';

import { delay, of } from 'rxjs';
import { ConsultantService } from 'src/app/services/consultant.service';

import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { DatePipe } from '@angular/common';
const baseUrl = `${environment.baseUrl}`;


declare const PDFObject: any;

@Component({
  selector: 'app-mission-by-id',
  templateUrl: './mission-by-id.component.html',
  styleUrls: ['./mission-by-id.component.css']
})
export class MissionByIdComponent {
  @Input() isLoading: boolean = false;
  personalInfo: any; // Adjust the type as per your data structure
  clientInfo: any;
  missionInfo: any;
  toggleValue: boolean = true;
  toggleValue1: string = 'true'
  dateOfBirthValue: string = 'true';
  emailValue: string = 'true';
  locationValue: string = 'true';
  phoneNumberValue: string = 'true';
  nationalityValue: string = 'true';
  socialSecurityNumberValue: string = 'true';
  identificationDocumentValue: string = 'true';
  ribValue: string = 'true';
  hasCarValue: string = 'true';
  drivingLicenseValue: string = 'true';
  carRegistrationValue: string = 'true';
  firstNameValue: string = 'true';
  companyValue: string = 'true';
  clientContactemailValue: string = 'true';
  positionValue: string = 'true';
  clientContactphoneNumberValue: string = 'true';
  professionValue: string = 'true';
  dailyRateValue: string = 'true';
  industrySectorValue: string = 'true';
  startDateValue: string = 'true';
  finalClientValue: string = 'true';
  endDateValue: string = 'true';
  clientlastNameValue: string = 'true';
  commantaireclientlastName: string = ''
  commantairetoggleValue: string = '';
  commantairetoggleValue1: string = '';
  commantairedateOfBirthValue: string = '';
  commantaireemailValue: string = '';
  commantairelocationValue: string = '';
  commantairephoneNumberValue: string = '';
  commantairenationalityValue: string = '';
  commantairesocialSecurityNumberValue: string = '';
  commantaireidentificationDocumentValue: string = '';
  commantaireribValue: string = '';
  commantairehasCarValue: string = '';
  commantairedrivingLicenseValue: string = '';
  commantairecarRegistrationValue: string = '';
  commantairefirstNameValue: string = '';
  commantairecompanyValue: string = '';
  commantaireclientContactemailValue: string = '';
  commantairepositionValue: string = '';
  commantaireclientContactphoneNumberValue: string = '';
  commantaireprofessionValue: string = '';
  commantairedailyRateValue: string = '';
  commantaireindustrySectorValue: string = '';
  commantairestartDateValue: string = '';
  commantairefinalClientValue: string = '';
  commantaireendDateValue: string = '';
  issLoading = false;
  hasCar: any;
  mission_id: any
  token: any;
  headers: any
  pdfData: any;
  res: any
  lastnotifications: any
  notification: string[] = [];
  new_notif: any
  constructor(private inscriptionservice: InscriptionService, private consultantservice: ConsultantService, private datePipe: DatePipe, private socketService: WebSocketService, private fb: FormBuilder, private userservice: UserService, private router: Router, private route: ActivatedRoute) {



  }
  loading: boolean = true;
  getMissionuserb: any
  TjmRequestsByMissionId: any
  zoomState: string = 'normal';
  userSelection: string = 'true';
  toggleZoom() {
    this.zoomState = this.zoomState === 'normal' ? 'zoomed' : 'normal';
  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  nblastnotifications: any
  gotoallnotification() {
    this.router.navigate([clientName + '/consultant/allnotifications'])
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  ngOnInit(): void {
    this.new_notif = localStorage.getItem('new_notif');
    const user_id = localStorage.getItem('user_id')
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.mission_id = params['id'];
    });
    this.token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `${this.token}`);
    // Listen for custom 'rhNotification' event in WebSocketService

    // Check if token is available

    this.consultantservice.getRhNotificationsnotseen().subscribe({
      next: (res1) => {
        this.nblastnotifications = res1.length
        this.lastnotifications = res1

      },
      error: (e) => {
        // Handle errors
        this.nblastnotifications = 0
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    // Check if token is available
    if (this.token) {
      // Include the token in the headers
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

      this.consultantservice.getMissionById(this.mission_id, this.headers).subscribe({
        next: (res) => {

          if (res.newMissionStatus == "VALIDATED") {
            this.getMissionuserb = res.newMissionStatus
            // Handle the response from the server
            this.personalInfo = res.personalInfo;
            this.clientInfo = res.clientInfo;
            this.missionInfo = res.missionInfo
            this.missionInfo.isSimulationValidated = baseUrl + "uploads/" + this.missionInfo.isSimulationValidated

            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");




            this.inscriptionservice.getPdf(this.missionInfo.isSimulationValidated).subscribe({
              next: (res) => {
                this.pdfData = res;
                this.isLoading = false;
                if (this.pdfData) {
                  this.handleRenderPdf(this.pdfData);
                }
              },
            });
          }
          else {
            this.consultantservice.getMissionById(this.mission_id, this.headers).subscribe({
              next: (res2) => {
                this.getMissionuserb = res2.newMissionStatus
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                // Handle the response from the server
                this.personalInfo = res2.personalInfo;
                this.clientInfo = res2.clientInfo;
                this.missionInfo = res2.missionInfo
                this.missionInfo.isSimulationValidated = baseUrl + "uploads/" + this.missionInfo.isSimulationValidated

                console.log(this.missionInfo.isSimulationValidated);




                this.inscriptionservice.getPdf(this.missionInfo.isSimulationValidated).subscribe({
                  next: (res) => {
                    this.pdfData = res;
                    this.isLoading = false;
                    if (this.pdfData) {
                      this.handleRenderPdf(this.pdfData);
                    }
                  },
                });
              },
              error: (e) => {
                // Handle errors
                console.error(e);
                // Set loading to false in case of an error
                this.loading = false;
              }
            })

          }







        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error
          this.loading = false;
        }
      });

      this.consultantservice.getallTjmRequestsByMissionId(this.mission_id).subscribe({
        next: (res) => {
          this.TjmRequestsByMissionId = res
          console.log("tjmmission", res);
        },
        error: (e) => {

          console.error(e);


        }
      });
      this.consultantservice.getlastnotificationsrh().subscribe({
        next: (res1) => {
          console.log(res1);
          this.lastnotifications = res1.slice(0, 10);
          for (let item of this.lastnotifications) {
            //getuserinfomation
            // this.consultantservice.getuserinfomation(item["userId"], this.headers).subscribe({
            //   next: (info) => {
            //     console.log(info);

            //     item["userId"] = info["firstName"] + ' ' + info["lastName"]
            //   }
            // })
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
          localStorage.setItem('new_notif', 'true');
        }

        // Handle your rhNotification event here
      });
    }
  }
  update_register() {
    const data = {
      "firstNameValidation": this.toggleValue,
      "firstNameCause": this.commantairetoggleValue,
      "lastNameValidation": this.toggleValue1,
      "lastNameCause": this.commantairetoggleValue1,
      "emailValidation": this.emailValue,
      "emailCause": this.commantaireemailValue,
      "phoneNumberValidation": this.phoneNumberValue,
      "phoneNumberCause": this.commantairephoneNumberValue,
      "dateOfBirthValidaton": this.dateOfBirthValue,
      "dateOfBirthCause": this.commantairedateOfBirthValue,
      "locationValidation": this.locationValue,
      "locationCause": this.commantairelocationValue,
      "nationalityValidation": this.nationalityValue,
      "nationalityCause": this.commantairenationalityValue,
      "socialSecurityNumberValidation": this.socialSecurityNumberValue,
      "socialSecurityNumberCause": this.commantairesocialSecurityNumberValue,
      "identificationDocumentValidation": this.identificationDocumentValue,
      "identificationDocumentCause": this.commantaireidentificationDocumentValue,
      "ribValidation": this.ribValue,
      "ribCause": this.commantaireribValue,
      "drivingLicenseValidation": this.drivingLicenseValue,
      "drivingLicenseCause": this.commantairedrivingLicenseValue,
      "carRegistrationValidation": this.carRegistrationValue,
      "carRegistrationCause": this.commantairecarRegistrationValue,
      "companyValidation": this.companyValue,
      "companyCause": this.commantairecompanyValue,
      "clientfirstNameValidation": this.firstNameValue,
      "clientfirstNameCause": this.commantairefirstNameValue,
      "clientlastNameValidation": this.clientContactemailValue,
      "clientlastNameCause": this.commantaireclientlastName,
      "clientPostionValidation": this.positionValue,
      "clientPositionCause": this.commantairepositionValue,
      "clientEmailValidation": this.clientContactemailValue,
      "clientEmailCause": this.commantaireclientContactemailValue,
      "clientphoneNumberValidation": this.clientContactphoneNumberValue,
      "clientphoneNumberCause": this.commantaireclientContactphoneNumberValue,
      "professionvalidation": this.professionValue,
      "professionCause": this.commantaireprofessionValue,
      "industrySectorValidated": this.industrySectorValue,
      "industrySectorCause": this.commantaireindustrySectorValue,
      "finalClientValidation": this.finalClientValue,
      "finalClientCause": this.commantairefinalClientValue,
      "dailyRateValidation": this.dailyRateValue,
      "dailyRateCause": this.commantairedailyRateValue,
      "startDateValidation": this.startDateValue,
      "startDateCause": this.commantairestartDateValue,
      "endDateValidation": this.endDateValue,
      "endDateCause": this.commantaireendDateValue
    }

    Swal.fire({
      title: "Confirmez l'action",
      background: '#fefcf1',
      html: `
        <div>
        <div style="font-size:1.2rem"> Êtes-vous sûr de vouloir soumettre <br> vote réponse a la demande ?  </div> 
          
        </div>
      `,
      iconColor: '#1E1E1E',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      confirmButtonColor: "#91c593",
      cancelButtonText: 'Annuler',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked 'Yes', call the endpoint
        this.inscriptionservice.validatenewmission(this.mission_id, data, this.headers).subscribe({
          next: (res) => {
            Swal.fire({
              background: '#fefcf1',

              title: 'Mission mise à jour avec succès !',
              confirmButtonText: 'OK',
              confirmButtonColor: "#91c593",
            });
            this.router.navigate([clientName + '/tjmrequests'])
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            Swal.fire('Error', "Aucune modification n'a été apportée.", 'error');
          }
        });
      } else {
        Swal.fire({
          background: '#fefcf1',
          title: 'Annulé',
          text: "Aucune modification n'a été apportée.",
          iconColor: '#1E1E1E',

          confirmButtonText: 'Ok',
          confirmButtonColor: "#91c593",
        })
        // // User clicked 'Cancel' or closed the popup
        // Swal.fire('Annulé',
        //   "Aucune modification n'a été apportée.", 'info');
      }
    });

  }

  onRadioChange(value: boolean) {
    // Update hasCar based on radio button change
    this.hasCar = value;
  }


  handleRenderPdf(data: any) {
    console.log(data);

    const pdfObject = PDFObject.embed(data, '#pdfContainer');


  }


}
