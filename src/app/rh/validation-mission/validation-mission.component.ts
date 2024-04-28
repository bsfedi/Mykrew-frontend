import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
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
  noteshow: any;
  stats: any;
  res: any
  show: any
  demandeur: any
  user_id: any
  constructor(private inscriptionservice: InscriptionService, private consultantservice: ConsultantService, private userservice: UserService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    // Ensure that the items array is correctly populated here if needed.
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.contract_id = params['id'];
      this.mission_id = params['id_mission']
    });

    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');



    this.userservice.getpersonalinfobyid(user_id).subscribe({


      next: (res) => {
        // Handle the response from the server
        this.res = res

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.getContaractById(this.contract_id, this.headers).subscribe({
        next: (res) => {
          this.show = true
          this.getContaractByPrerigister = res
          console.log(res);
          this.contactClient = res.contactClient
          this.clientValidation = res.clientValidation
          this.contractValidation = res.contractValidation
          this.jobCotractEdition = res.jobCotractEdition
          // Handle the response from the server
          this.idcontractByPreregister = res._id

          if (this.contactClient == "VALIDATED") {
            this.contactClient = 'true'
          }
          else if (this.contactClient == 'PENDING') {
            this.contactClient = 'false'
          }
          else {
            this.contactClient = 'DESACTIVATED'
          }



          if (this.clientValidation == "VALIDATED") {
            this.clientValidation = 'true'
          }
          else if (this.clientValidation == 'PENDING') {
            this.clientValidation = 'false'
          }
          else {
            this.clientValidation = 'DESACTIVATED'
          }


          if (this.contractValidation == "VALIDATED") {
            this.contractValidation = 'true'
          }
          else if (this.contractValidation == 'PENDING') {
            this.contractValidation = 'false'
          }
          else {
            this.contractValidation = 'DESACTIVATED'
          }


          if (this.jobCotractEdition == "VALIDATED") {
            this.jobCotractEdition = 'true'
          }
          else if (this.jobCotractEdition == 'PENDING') {
            this.jobCotractEdition = 'false'
          }
          else {
            this.jobCotractEdition = 'DESACTIVATED'
          }









        },
        error: (e) => {

          console.error(e);


        }
      });
      this.consultantservice.getTjmStats().subscribe({


        next: (res) => {
          this.stats = res
          console.log(this.stats);


        }
      });
    }

  }
  shownote() {
    this.noteshow = !this.noteshow
  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }

  gototjm() {
    this.router.navigate([clientName + '/tjmrequests'])

  }
  killmission(message: any) {
    const data = {
      "note": message
    }
    Swal.fire({
      title: 'Confirmer les modifications',
      html: `
        <div>
        <div style="font-size:1.2rem;">  Êtes-vous sûr de vouloir <br> mettre à jour la mission ?  </div> 
        </div>
      `,
      iconColor: '#1E1E1E',
      background: '#fefcf1',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      confirmButtonColor: "#91c593",
      cancelButtonText: 'Non',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultantservice.killnewMission(this.mission_id, data, this.headers).subscribe({
          next: (res) => {
            console.log(res.text);


          },
          error: (e) => {
            // Handle errors
            if (e.error.text == 'Mission Killed Successfully') {
              // Handle success
              Swal.fire({
                background: '#fefcf1',
                title: 'Mission terminée',
                text: "La mission est maintenant refusée et marquée terminée",
                confirmButtonText: 'OK',
                confirmButtonColor: "#91c593",

              });
              this.router.navigate([clientName + '/dashboard'])
              // this.router.navigate([clientName +'/dashboard'])
            }


            else {
              Swal.fire('Error', 'Tu peux pas terminer une mission validé', 'error');
            }

          }

        });

        // User clicked 'Yes', call the endpoint

      } else {
        Swal.fire({
          title: 'Annulé',
          background: '#fefcf1',
          text: "Aucune modification n'a été apportée.",
          confirmButtonText: 'Ok',
          confirmButtonColor: "#91c593",
        })
        // // User clicked 'Cancel' or closed the popup
        // Swal.fire('Annulé',
        //   "Aucune modification n'a été apportée.", 'info');
      }
    });


  }
  click() {
    this.router.navigate([clientName + '/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/validation/' + _id])
  }
  gotomissions(_id: string) {
    this.router.navigate([clientName + '/missions/' + _id])
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
        window.location.reload();
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
        window.location.reload();
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
        window.location.reload();
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateContractValidation(id: any, contractValidation: any): void {
    console.log(contractValidation);

    if (contractValidation == 'true' || contractValidation == 'false') {
      const data = {
        "validated": contractValidation
      }
      console.log(data);

      this.consultantservice.validateContractValidation(this.contract_id, data, this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server
          console.log(res);

          this.router.navigate([clientName + '/dashboard']);
        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }

  }

}
