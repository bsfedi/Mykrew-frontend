import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
// auth.service.ts

import { InscriptionService } from 'src/app/services/inscription.service';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'app-pending-preinscription',
  templateUrl: './pending-preinscription.component.html',
  styleUrls: ['./pending-preinscription.component.css']
})
export class PendingPreinscriptionComponent {

  res: any
  clientValidation: any
  contactClient: any
  contractValidation: any
  jobCotractEdition: any
  validation_rh: any
  constructor(private userservice: UserService, private inscriptionService: InscriptionService, private fb: FormBuilder, private router: Router) {

  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    // Check if token is available
    if (token) {
      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);

      this.inscriptionService.getMyPreRegister(headers).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.res = res

          // this.res.status = 'NOTVALIDATED'

          this.inscriptionService.getContaractByPrerigister(this.res._id, headers).subscribe({
            next: (res1) => {


              console.log(res1);


              this.validation_rh = this.res.status
              this.clientValidation = res1.clientValidation
              this.contactClient = res1.contactClient
              this.contractValidation = res1.contractValidation
              this.jobCotractEdition = res1.jobCotractEdition
              if (this.validation_rh == 'VALIDATED' && this.clientValidation == 'VALIDATED' && this.contactClient == 'VALIDATED' && this.contractValidation == 'VALIDATED' && this.jobCotractEdition == 'VALIDATED') {
                this.router.navigate(['/consultant/missions']);
              }



            },
            error: (e) => {
              // Handle errors
              console.error(e);
              // Set loading to false in case of an error

            }
          });
        },
        error: (e) => {
          // Handle errors
          console.error(e);
        }
      });



    }
  }

  navigatetoinfomations() {
    this.router.navigate(['/informations/' + this.res._id])

  }
}
