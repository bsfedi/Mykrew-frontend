import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';

import { delay, of } from 'rxjs';




declare const PDFObject: any;

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css'],

})
export class ValidationComponent implements OnInit {
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
  portage: string = 'true';
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
  commantaireportageValue: string = '';
  commantaireclientlastName: string = '';
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
  preinscription_id: any
  token: any;
  headers: any
  pdfData: any;
  ispdfdocrib: any
  constructor(private inscriptionservice: InscriptionService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {



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
      this.preinscription_id = params['id'];
    });
    this.token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `${this.token}`);

    // Check if token is available
    if (this.token) {
      // Include the token in the headers

      this.inscriptionservice.getPreinscriptionById(this.preinscription_id, this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.personalInfo = res.personalInfo;
          this.clientInfo = res.clientInfo;
          this.missionInfo = res.missionInfo
          this.personalInfo.identificationDocument.value = "https://my-krew-8nnq.onrender.com/uploads/" + this.personalInfo.identificationDocument.value
          this.personalInfo.dateOfBirth.value = this.personalInfo.dateOfBirth.value.split('T')[0]
          this.personalInfo.carInfo.drivingLicense.value = "https://my-krew-8nnq.onrender.com/uploads/" + this.personalInfo.carInfo.drivingLicense.value
          this.personalInfo.ribDocument.value = "https://my-krew-8nnq.onrender.com/uploads/" + this.personalInfo.ribDocument.value
          this.missionInfo.isSimulationValidated.value = "https://my-krew-8nnq.onrender.com/uploads/" + this.missionInfo.isSimulationValidated.value
          this.missionInfo.startDate.value.split('T')[0]
          this.hasCar = this.personalInfo.carInfo.hasCar.value;
          this.loading = false;
          this.isLoading = true;
          if (this.personalInfo.ribDocument.value.endsWith('.pdf')) {
            this.inscriptionservice.getPdf(this.personalInfo.ribDocument.value).subscribe({
              next: (res) => {
                this.pdfData = res;
                this.isLoading = false;
                if (this.pdfData) {
                  this.handlesecondRenderPdf(this.pdfData);
                }
              },
            });
            this.ispdfdocrib = true
          } else {
            this.ispdfdocrib = false
          }

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
      'portage': this.portage,
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
      text: "Êtes-vous sûr de vouloir mettre à jour l'inscription ?",
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
        this.inscriptionservice.rhvalidation(this.preinscription_id, data, this.headers).subscribe({
          next: (res) => {
            // Handle success
            Swal.fire('Success', "l'inscription mis a jour avec succées!", 'success');
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: 'Registration updated successfully!',
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigate(['/dashboard'])
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            Swal.fire('Error', 'Failed to update registration.', 'error');
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
  handlesecondRenderPdf(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer1');

  }
  killmission(killed: any) {
    console.log(killed);
    if (killed == true) {


      this.inscriptionservice.killmission(this.preinscription_id, this.headers).subscribe({
        next: (res) => {
          console.log(res);

        }

      })
    }

  }

  onRadioChange(value: boolean) {
    // Update hasCar based on radio button change
    this.hasCar = value;
  }


  handleRenderPdf(data: any) {

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
