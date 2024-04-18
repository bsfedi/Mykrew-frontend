import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})

export class MissionComponent {
  userSelection: string = 'true';
  myForm: FormGroup;
  selectedFile: File | null = null;
  isSimulationValidated: string | null = null;

  constructor(private inscriptionservice: InscriptionService, private fb: FormBuilder, private router: Router) {

    this.myForm = this.fb.group({
      profession: ['', Validators.required],
      industrySector: ['', Validators.required],
      finalClient: ['', Validators.required],
      dailyRate: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isSimulationValidated: ['', Validators.required],
      // Add other form controls as needed
    });

  }

  ngOnInit(): void {

  }
  isEndDateBeforeStartDate(): boolean {
    const endDate = this.myForm.value.endDate;
    const startDate = this.myForm.value.startDate;
    return endDate < startDate;
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
  drivingLicense(event: any) {
    const fileInput = event.target.files[0];
    return fileInput

  }

  submit(): void {
    const token = localStorage.getItem('token');

    // Check if token is available
    if (token) {
      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);


      this.inscriptionservice.getMyPreRegister(headers).subscribe({


        next: (res: any) => {
          // Handle the response from the server


          if (this.areAllFieldsFilled() == false) {
            this.myForm.markAllAsTouched();
            return;
          }
          else {
            const formData = new FormData();
            formData.append('profession', this.myForm.value.profession);
            formData.append('industrySector', this.myForm.value.industrySector);
            formData.append('finalClient', this.myForm.value.finalClient);
            formData.append('dailyRate', this.myForm.value.dailyRate);
            formData.append('endDate', this.myForm.value.endDate);
            formData.append('startDate', this.myForm.value.startDate);
            const isSimulationValidatedeee = this.fileInputs.isSimulationValidated.files[0];
            formData.append('isSimulationValidated', isSimulationValidatedeee);
            if (res?.missionInfo.missionKilled == false) {
              this.inscriptionservice.createinscrptionstep3(formData, headers)
                .subscribe({
                  next: (res) => {
                    // Handle the response from the server
                    console.log(res);
                    // this.router.navigate([clientName +'/client']);
                    // this.router.navigate([clientName +'/informations/' + res._id]);
                    this.router.navigate([clientName + '/pending'])
                  },
                  error: (e) => {
                    // Handle errors
                    console.error(e);
                  }
                });

            }
            else {
              this.inscriptionservice.createinscrptionstep5(formData, headers)
                .subscribe({
                  next: (res) => {
                    // Handle the response from the server
                    console.log(res);
                    // this.router.navigate([clientName +'/client']);
                    // this.router.navigate([clientName +'/informations/' + res._id]);
                    this.router.navigate([clientName + '/pending'])
                  },
                  error: (e) => {
                    // Handle errors
                    console.error(e);
                  }
                });

            }

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
  // Assuming you have an object to hold file inputs
  fileInputs: any = {};

  setFileInput(field: string, event: any): void {

    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log(this.selectedFile);

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'isSimulationValidated') {
          console.log(this.isSimulationValidated);

          this.isSimulationValidated = e.target!.result as string;
        }
      }
    }
  }
}
