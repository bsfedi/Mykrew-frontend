import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';

@Component({
  selector: 'app-personal-doc',
  templateUrl: './personal-doc.component.html',
  styleUrls: ['./personal-doc.component.css']
})
export class PersonalDocComponent {
  userSelection: string = 'false';
  show_doc: boolean = false
  myForm: FormGroup;
  DocPersolForm: FormGroup; // New FormGroup for additional section
  voitureForm: FormGroup;
  selectedFile: File | null = null;
  cin_img: string | null = null;
  selectedFile1: File | null = null;
  permis_img: string | null = null;
  carRegistration_img: string | null = null;
  Passport_img: string | null = null;
  ribdoc_img : string | null =null ;

  constructor(private inscriptionservice: InscriptionService, private fb: FormBuilder, private router: Router) {

    this.myForm = this.fb.group({

    });
    // Initialize the additional form
    this.DocPersolForm = this.fb.group({
      socialSecurityNumber: [''],
      idCardFile: ['', Validators.required],
      passportFile: ['', Validators.required],
      rib: ['', Validators.required],
      ribdoc :['', Validators.required],
      // Add other controls for the additional form as needed
    });
    this.voitureForm = this.fb.group({
      voiture: ['', Validators.required],
      Permis: [''],
    })
    this.myForm.addControl('voitureForm', this.voitureForm);
    // Add the additional form as a nested group to the main form
    this.myForm.addControl('DocPersolForm', this.DocPersolForm);
  }

  drivingLicense(event: any) {
    const fileInput = event.target.files[0];
    return fileInput

  }
  // Add this method inside your PreInscriptionComponent class
  areAllFieldsFilled(): boolean {
    const formValues = this.DocPersolForm.value;
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

      this.DocPersolForm.markAllAsTouched();
      this.DocPersolForm.markAsPristine()
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




      // formData.append('Passport', Passport);

      if (this.DocPersolForm.pristine) {
        this.DocPersolForm.markAllAsTouched();
        this.voitureForm.markAllAsTouched()
        return;
      } else {
        const formData = new FormData();
        formData.append('socialSecurityNumber', this.myForm.value.DocPersolForm.socialSecurityNumber);
        formData.append('rib', this.myForm.value.DocPersolForm.rib);
        formData.append('hasCar', this.myForm.value.voitureForm.voiture);
     
  
        // Assuming these are the file input names in your form 
        const identificationDocument = this.fileInputs.identificationDocument.files[0];
        const ribdoc = this.fileInputs.ribdoc.files[0];
        if (this.myForm.value.voitureForm.voiture === 'true') {
          const drivingLicense = this.fileInputs.drivingLicense.files[0];
  
  
          // Append the files if they exist, else append empty strings
          formData.append('drivingLicense', drivingLicense);
  
        } else {
          formData.append('drivingLicense', ''); // Append an empty string
  
        }
  
  
  
        formData.append('identificationDocument', identificationDocument);
        formData.append('ribDocument',ribdoc)
        this.inscriptionservice.createinscrptiondoc(formData, headers)
          .subscribe({
            next: (res) => {
              

              // Handle the response from the server
            
              this.router.navigate(['/client']);
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
  fileName: string = '';

  setFileInput(field: string, event: any): void {

    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'identificationDocument') {
          this.cin_img = e.target!.result as string;
        }
        else if (field == 'drivingLicense') {
          this.permis_img = e.target!.result as string;
        }
        else if (field == 'carRegistration') {
          this.carRegistration_img = e.target!.result as string;
        }
        else if (field == 'ribdoc') {
      
          
          this.ribdoc_img = e.target!.result as string;
        }
        else {
          this.Passport_img = e.target!.result as string;
        }
      };
      reader.readAsDataURL(this.selectedFile);
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
