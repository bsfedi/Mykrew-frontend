import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
// auth.service.ts
import { Injectable } from '@angular/core';
import { InscriptionService } from 'src/app/services/inscription.service';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-singin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signinForm: FormGroup;
  succesmessage = '';
  failedmessage = ''
  showerrormessage = false
  showsucessmessage = false
  res: any
  clientValidation: any
  contactClient: any
  contractValidation: any
  jobCotractEdition: any
  validation_rh: any
  constructor(private userservice: UserService, private inscriptionservice: InscriptionService, private fb: FormBuilder, private router: Router) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }
  isAuthenticated() {
    return true;
  }
  hasRole(role: any) {
    if (role == localStorage.getItem('role')) {
      return true;
    }
    else {
      return false
    }

  }
  login(): void {
    if (this.signinForm.pristine) {
      this.signinForm.markAllAsTouched();
      return;
    }

    const data = {
      email: this.signinForm.value.email,
      password: this.signinForm.value.password
    };
    console.log(data);

    this.userservice.login(data)
      .subscribe({
        next: (res) => {
          this.showerrormessage = false;
          this.showsucessmessage = true;

          // Save the token in local storage
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('user_id', res.id);
          
          if (res.role == 'CONSULTANT') {
            const headers = new HttpHeaders().set('Authorization', `${res.token}`);

            this.inscriptionservice.getMyPreRegister(headers).subscribe({


              next: (res) => {
                // Handle the response from the server
                this.res = res


                if (this.res.status == 'NOTEXIST') {
                  this.router.navigate(['/pre-inscription']);
                }
                else if (this.res.status == 'VALIDATED') {
                  if (this.res.missionInfo.missionKilled == true) {
                    this.router.navigate(['/mission']);
                  }
                  else {
                    this.inscriptionservice.getContaractByPrerigister(this.res._id, headers).subscribe({
                      next: (res1) => {


                        console.log(res1);


                        this.validation_rh = this.res.status
                        this.clientValidation = res1.clientValidation
                        this.contactClient = res1.contactClient
                        this.contractValidation = res1.contractValidation
                        this.jobCotractEdition = res1.jobCotractEdition
                        if (this.validation_rh == 'VALIDATED' || this.clientValidation == 'VALIDATED' || this.contactClient == 'VALIDATED' || this.contactClient == 'VALIDATED' || this.jobCotractEdition == 'VALIDATED') {
                          this.router.navigate(['consultant/missions']);
                        }
                        else {
                          this.router.navigate(['consultant/missions']);
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
                else {
                  this.router.navigate(['/pending']);
                }







              },
              error: (e) => {
                // Handle errors
                console.error(e);
                // Set loading to false in case of an error

              }
            });
            // 
          }
          else {
            this.router.navigate(['/dashboard']);
          }
          // Navigate to /informations on successful login

        },
        error: (e) => {
          this.failedmessage = e.error.message;
          this.showerrormessage = true;
          this.showsucessmessage = false;
        }
      });

    console.log(data);
  }
}
