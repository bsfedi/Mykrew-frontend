import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';

import { delay, of } from 'rxjs';
import { ConsultantService } from 'src/app/services/consultant.service';




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
  commantaireclientlastName: string = 'true'
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

  constructor(private inscriptionservice: InscriptionService, private consultantservice: ConsultantService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {



  }
  loading: boolean = true;

  zoomState: string = 'normal';
  userSelection: string = 'true';
  toggleZoom() {
    this.zoomState = this.zoomState === 'normal' ? 'zoomed' : 'normal';
  }

  ngOnInit(): void {

    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.mission_id = params['id'];
    });
    this.token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `${this.token}`);

    // Check if token is available
    if (this.token) {
      // Include the token in the headers

      this.consultantservice.getMissionuserbyid(this.mission_id, this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.personalInfo = res.personalInfo;
          this.clientInfo = res.clientInfo;
          this.missionInfo = res.missionInfo

          console.log(res);



          this.missionInfo.isSimulationValidated = "https://my-krew-8nnq.onrender.com/uploads/" + this.missionInfo.isSimulationValidated

          console.log(this.missionInfo.isSimulationValidated);

          this.loading = false;
          this.isLoading = true;


          this.inscriptionservice.getPdf(this.missionInfo.isSimulationValidated.value).subscribe({
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
      "professionCause": this.commantairepositionValue,
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

    // Display confirmation popup
    Swal.fire({
      title: 'Confirmer les modifications',
      text: "Êtes-vous sûr de vouloir soumettre vos informations personnelles ? ",
      icon: 'question',
      iconColor: '#1E1E1E',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettez à jour !',
      confirmButtonColor: "#1E1E1E",
      

      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'custom-confirm-button-class'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked 'Yes', call the endpoint
        this.inscriptionservice.validatenewmission(this.mission_id, data, this.headers).subscribe({
          next: (res) => {
            // Handle success
            Swal.fire('Success', 'Mission mise à jour avec succès !', 'success');
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: 'Mission mise à jour avec succès !',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            Swal.fire('Error', "Aucune modification n'a été apportée.", 'error');
          }
        });
      } else {
        Swal.fire({
          title: 'Annulé',
          text: "Aucune modification n'a été apportée.",
          icon: 'info',
          iconColor: '#1E1E1E',

          confirmButtonText: 'Ok',
          confirmButtonColor: "#1E1E1E",
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
  update_register1() {
    Swal.fire({
      title: 'Custom Button Color',
      text: 'This is a SweetAlert with custom button color!',

      showCancelButton: true,
      confirmButtonText: 'Custom Confirm Button',
      cancelButtonText: 'Custom Cancel Button',
      customClass: {
        confirmButton: 'custom-confirm-class',
        cancelButton: 'custom-cancel-class'
      },
      buttonsStyling: false,
    });
  }


}
