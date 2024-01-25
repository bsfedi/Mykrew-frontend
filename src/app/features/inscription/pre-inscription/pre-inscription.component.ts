import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
@Component({
  selector: 'app-pre-inscription',
  templateUrl: './pre-inscription.component.html',
  styleUrls: ['./pre-inscription.component.css']
})
export class PreInscriptionComponent {
  userSelection: string = 'true';
  show_doc: boolean = false
  myForm: FormGroup;

  selectedFile: File | null = null;
  cin_img: string | null = null;
  selectedFile1: File | null = null;
  permis_img: string | null = null;
  carRegistration_img: string | null = null;
  Passport_img: string | null = null;

  constructor(private inscriptionservice: InscriptionService, private fb: FormBuilder, private router: Router) {

    this.myForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lieuNaissance: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      pays: ['France', Validators.required],
      portage: ['', Validators.required]
      // Add other form controls as needed
    });

  }

  drivingLicense(event: any) {
    const fileInput = event.target.files[0];
    return fileInput

  }
  // Add this method inside your PreInscriptionComponent class
  areAllFieldsFilled(): boolean {
    const formValues = this.myForm.value;
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        const value = formValues[key];
        if (value === null || value === undefined || value === '') {
          return false; // At least one field is empty
        }
      }
    }
    return true; // All fields are filled
  }

  show_div_doc() {
    if (this.areAllFieldsFilled() == false) {

      this.myForm.markAllAsTouched();
      this.myForm.markAsPristine()
      this.show_doc = false

      return;
    }

    else {


      this.show_doc = true
    }

  }
  logForm(): void {
    const token = localStorage.getItem('token');

    // Check if token is available
    if (token) {
      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);



      const formData = new FormData();

      formData.append('firstName', this.myForm.value.firstName);
      formData.append('lastName', this.myForm.value.lastName);
      formData.append('email', this.myForm.value.email);
      formData.append('phoneNumber', this.myForm.value.phoneNumber);
      formData.append('dateOfBirth', this.myForm.value.birthDate);
      formData.append('location', this.myForm.value.lieuNaissance);
      formData.append('nationality', this.myForm.value.pays);
      formData.append('portage', this.myForm.value.portage)
      const payload = {
        'firstName': this.myForm.value.firstName,
        'lastName': this.myForm.value.lastName,
        'email': this.myForm.value.email,
        'phoneNumber': this.myForm.value.phoneNumber,
        'dateOfBirth': this.myForm.value.birthDate,
        'location': this.myForm.value.lieuNaissance,
        'nationality': this.myForm.value.pays,
        'portage': this.myForm.value.portage
      }

      console.log('Form Data:', this.myForm.value);
      console.log(headers);
      if (this.myForm.pristine) {
        this.myForm.markAllAsTouched();
        // this.voitureForm.markAllAsTouched()
        return;
      } else {
        this.inscriptionservice.createinscrption(payload, headers)
          .subscribe({
            next: (res) => {


              // Handle the response from the server
              console.log(res);
              this.router.navigate(['/personaldoc']);
            },
            error: (e) => {
              // Handle errors
              console.error(e);
            }
          });


      }
    }
  }


  // Recursively mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
