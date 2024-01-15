import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-validation-mission',
  templateUrl: './validation-mission.component.html',
  styleUrls: ['./validation-mission.component.css']
})
export class ValidationMissionComponent {
  items: any;
  showPopup: boolean = false;
  showPopup1: boolean = false;
  isMenuOpen: boolean[] = [];
  headers: any
  clientValidation: any
  contactClient: any
  nbdemande: any
  contractValidation: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  contract_id: any
  mission_id: any
  noteValue: string = '';
  noteshow :any ;
  constructor(private inscriptionservice: InscriptionService, private consultantservice: ConsultantService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    // Ensure that the items array is correctly populated here if needed.
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');

    this.route.params.subscribe((params) => {
      this.contract_id = params['id'];
      this.mission_id =params['id_mission']
    });

    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.consultantservice.getContaractById(this.contract_id, this.headers).subscribe({
        next: (res) => {

          this.getContaractByPrerigister = res
          console.log(res);

          // Handle the response from the server
          this.idcontractByPreregister = res._id
          if (res.clientValidation == "VALIDATED") {
            this.clientValidation = 'true'
          }
          else {
            this.clientValidation = 'false'
          }
          if (res.contactClient == "VALIDATED") {
            this.contactClient = 'true'
          }
          else {
            this.contactClient = 'false'
          }
          if (res.contractValidation == "VALIDATED") {
            this.contractValidation = 'true'
          }
          else {
            this.contractValidation = 'false'
          }
          if (res.jobCotractEdition == "VALIDATED") {
            this.jobCotractEdition = 'true'
          }
          else {
            this.jobCotractEdition = 'false'
          }







        },
        error: (e) => {

          console.error(e);


        }
      });

    }

  }
  shownote(){
    this.noteshow =true
  }
  killmission(message :any){
    const data = {
      "note":  message
    }
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
        
        this.consultantservice.killnewMission(this.mission_id,data,this.headers).subscribe({
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
  click() {
    this.router.navigate(['/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate(['/validation/' + _id])
  }
  gotomissions(_id: string) {
    this.router.navigate(['/missions/' + _id])
  }
  openPopup(): void {
    this.showPopup = true;
  }
  openPopup1(id: any): void {



    this.showPopup1 = true;
  }

  validatePriseDeContact(id: any, contactClient: any): void {
    console.log(id);

    const data = {
      "validated": contactClient
    }
    console.log(data);

    this.consultantservice.validatePriseDeContact(this.contract_id, data, this.headers).subscribe({
      next: (res) => {
        console.log(res);

        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateClientValidation(id: any, clientValidation: any): void {
    const data = {
      "validated": clientValidation
    }
    this.consultantservice.validateClientValidation(this.contract_id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateJobCotractEdition(mission_id: any, jobCotractEdition: any): void {
    const data = {
      "validated": jobCotractEdition
    }
    console.log(data);

    this.consultantservice.validateJobCotractEdition(this.contract_id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateContractValidation(id: any, contractValidation: any): void {
    const data = {
      "validated": contractValidation
    }
    console.log(data);

    this.consultantservice.validateContractValidation(this.contract_id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }

}
