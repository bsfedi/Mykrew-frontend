import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
  userSelection: string = 'true';
  myForm: FormGroup;
  items = ['Item 1', 'Item 2', 'Item 3'];

  constructor(private inscriptionservice: InscriptionService, private fb: FormBuilder, private router: Router) {

    this.myForm = this.fb.group({
      company: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      phoneNumber: ['', Validators.required],
      // Add other form controls as needed
    });

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

  submit(): void {
    const token = localStorage.getItem('token');

    // Check if token is available
    if (token) {
      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);




      if (this.areAllFieldsFilled() == false) {
        this.myForm.markAllAsTouched();
        return;
      }
      else {
        this.inscriptionservice.createinscrptionstep2(this.myForm.value, headers)
          .subscribe({
            next: (res) => {
              // Handle the response from the server
              console.log(res);
              this.router.navigate(['/mission']);

            },
            error: (e) => {
              // Handle errors
              console.error(e);
            }
          });
      }

    }
  }

  // Assuming you have an object to hold file inputs
  fileInputs: any = {};

  // Function to set the file input for a specific field
  setFileInput(field: string, event: any): void {
    this.fileInputs[field] = event.target;
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
