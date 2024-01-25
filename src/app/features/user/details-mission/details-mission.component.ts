import { Component, Input, OnInit } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';

declare const PDFObject: any;

@Component({
  selector: 'app-details-mission',
  templateUrl: './details-mission.component.html',
  styleUrls: ['./details-mission.component.css']
})
export class DetailsMissionComponent {
  item: any;
  showPopup: boolean = false;
  showPopup1: boolean = false;
  isMenuOpen: boolean[] = [];
  headers: any
  clientInfo: any;
  missionInfo: any;
  clientValidation: any
  contactClient: any
  nbdemande: any
  contractValidation: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  mission_id: any
  pdfData: any;
  myForm: FormGroup;
  status : any
  constructor(private consultantservice: ConsultantService, private inscriptionservice: InscriptionService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
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
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.mission_id = params['id'];
    });


    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.consultantservice.getUserMissionById(this.mission_id, this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.status = res.newMissionStatus
          console.log(this.status);
          
          this.clientInfo = res.clientInfo;
          this.missionInfo = res.missionInfo
          

          this.inscriptionservice.getPdf("https://my-krew-8nnq.onrender.com/uploads/" + this.item.missionInfo.isSimulationValidated).subscribe({
            next: (res) => {
              this.pdfData = res;

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

        }
      });
    }
  }
  handleRenderPdf(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer');

  }
  click() {
    this.router.navigate(['/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate(['/validation/' + _id])
  }
  openPopup(): void {
    this.showPopup = true;
  }
  openPopup1(id: any): void {

  }
  closePopup(): void {
    this.showPopup = false;

  }
  closePopup1(): void {
    this.showPopup1 = false;

  }

  validatePriseDeContact(id: any, contactClient: any): void {
    console.log(id);

    const data = {
      "validated": contactClient
    }
    console.log(data);
  }
  validateClientValidation(id: any, clientValidation: any): void {
    const data = {
      "validated": clientValidation
    }

  }
  validateJobCotractEdition(id: any, jobCotractEdition: any): void {
    const data = {
      "validated": jobCotractEdition
    }
  }
  validateContractValidation(id: any, jobCotractEdition: any): void {
    const data = {
      "validated": jobCotractEdition
    }
    // this.inscriptionservice.validateContractValidation(id, data, this.headers).subscribe({
    //   next: (res) => {
    //     // Handle the response from the server
    //   },
    //   error: (e) => {
    //     // Handle errors
    //     console.error(e);
    //     // Set loading to false in case of an error

    //   }
    // });
  }

  edit() {

    const formData = new FormData();


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
    formData.append('simulationValidation', '1702545972864-sample.pdf');




    this.consultantservice.editmission(formData, this.mission_id, this.headers).subscribe({
      next: (res) => {
        // Handle success
        console.log(res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });




  }
}
