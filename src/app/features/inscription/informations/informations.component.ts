import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
declare const PDFObject: any;


@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css']
})
export class InformationsComponent {
  @Input() isLoading: boolean = false;
  personalInfo: any; // Adjust the type as per your data structure
  clientInfo: any;
  missionInfo: any;
  status_preregister: any
  toggleValue: string = 'a';
  preinscription_id: any
  hasCar: any;
  pdfData: any;
  headers: any;
  myForm: FormGroup;
  cin_img: string | null = null;
  constructor(private inscriptionservice: InscriptionService, private userservice: UserService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
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
  loading: boolean = true;

  zoomState: string = 'normal';
  userSelection: string = 'true';
  toggleZoom() {
    this.zoomState = this.zoomState === 'normal' ? 'zoomed' : 'normal';
  }
  ngOnInit(): void {
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.preinscription_id = params['id']
    });
    const token = localStorage.getItem('token');

    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.inscriptionservice.getPreinscriptionById(this.preinscription_id, this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.status_preregister = res.status
          this.personalInfo = res.personalInfo;
          this.clientInfo = res.clientInfo;
          this.missionInfo = res.missionInfo
          this.personalInfo.identificationDocument.value = "https://my-krew-8nnq.onrender.com/uploads/" + this.personalInfo.identificationDocument.value
          this.personalInfo.dateOfBirth.value = this.personalInfo.dateOfBirth.value.split('T')[0]
          this.personalInfo.carInfo.drivingLicense.value = "https://my-krew-8nnq.onrender.com/uploads/" + this.personalInfo.carInfo.drivingLicense.value
          this.personalInfo.carInfo.carRegistration.value = "https://my-krew-8nnq.onrender.com/uploads/" + this.personalInfo.carInfo.carRegistration.value
          this.missionInfo.isSimulationValidated.value = "https://my-krew-8nnq.onrender.com/uploads/" + this.missionInfo.isSimulationValidated.value
          this.personalInfo.ribDocument.value = "https://my-krew-8nnq.onrender.com/uploads/" + this.personalInfo.ribDocument.value
          console.log(this.personalInfo.carInfo.drivingLicense.value);
          console.log(this.personalInfo?.dateOfBirth.causeNonValidation);
          this.hasCar = this.personalInfo.carInfo.hasCar.value;

          this.inscriptionservice.getPdf(this.missionInfo.isSimulationValidated.value).subscribe({
            next: (res) => {
              this.pdfData = res;
              this.isLoading = false;
              if (this.pdfData) {
                this.handleRenderPdf(this.pdfData);
              }
            },
          });

          this.inscriptionservice.getPdf(this.personalInfo.ribDocument.value ).subscribe({
            next: (res) => {
              this.pdfData = res;
              this.isLoading = false;
              if (this.pdfData) {
                this.handlesecondRenderPdf(this.pdfData);
              }
            },
          });



          console.log(this.clientInfo.company.value)

          this.loading = false;
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
  onRadioChange(value: boolean) {
    // Update hasCar based on radio button change
    this.hasCar = value;
  }
  handleRenderPdf(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer');

  }
  handlesecondRenderPdf(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer1');

  }
  edit() {

    const formData = new FormData();


    // Append values directly to formData
    formData.append('firstName', this.myForm.value.firstName);
    formData.append('lastName', this.myForm.value.lastName);
    formData.append('email', this.myForm.value.email);
    formData.append('phoneNumber', this.myForm.value.phoneNumber);
    formData.append('dateOfBirth', this.myForm.value.dateOfBirth);
    formData.append('location', this.myForm.value.location);
    formData.append('nationality', this.myForm.value.nationality);
    formData.append('socialSecurityNumber', this.myForm.value.socialSecurityNumber);
    formData.append('identificationDocument', this.myForm.value.identificationDocument);
    formData.append('rib', this.myForm.value.rib);
    formData.append('hasCar', this.myForm.value.hasCar);
    formData.append('drivingLicense', '1702545951096-permis.jpg');
    formData.append('company', this.myForm.value.company);
    formData.append('clientfirstName', this.myForm.value.clientfirstName);
    formData.append('clientlastName', this.myForm.value.clientlastName);
    formData.append('clientPostion', this.myForm.value.clientPostion);
    formData.append('clientEmail', this.myForm.value.clientEmail);
    formData.append('clientphoneNumber', this.myForm.value.clientphoneNumber);
    formData.append('profession', this.myForm.value.profession);
    formData.append('industrySector', this.myForm.value.industrySector);
    formData.append('finalClient', this.myForm.value.finalClient);
    formData.append('dailyRate', this.myForm.value.dailyRate);
    formData.append('startDate', this.myForm.value.startDate);
    formData.append('endDate', this.myForm.value.endDate);
    formData.append('simulationValidation', this.myForm.value.simulationValidation);


    // Display confirmation popup
    Swal.fire({
      title: 'Confirmer les modifications',
      text: "Êtes-vous sûr de vouloir mettre à jour l'enregistrement ?",
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

        this.userservice.editinscription(formData, this.preinscription_id, this.headers).subscribe({
          next: (res) => {
            // Handle success
            Swal.fire('Success', 'Registration updated successfully!', 'success');
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: 'Registration updated successfully!',
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigate(['/pending'])
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            // Set loading to false in case of an error
            this.loading = false;
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
  
}
