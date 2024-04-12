import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


const clientName = `${environment.default}`;
const baseUrl = `${environment.baseUrl}`;
@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.css']
})
export class EditProfilComponent {
  res: any
  headers: any
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: number = 0;
  location: string = '';
  nationality: string = '';
  user_id: any
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  role: any;
  constructor(private inscriptionservice: InscriptionService, private userservice: UserService, private router: Router) {

  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.user_id = localStorage.getItem('user_id')
    this.role = localStorage.getItem('role')


    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.userservice.getpersonalinfobyid(this.user_id).subscribe((user: any) => {
        this.firstName = user.firstName ?? '';
        this.lastName = user.lastName ?? '';
        this.email = user.email ?? '';
        this.phoneNumber = user.phoneNumber !== undefined ? user.phoneNumber : null;
        this.location = user.location ?? '';
        this.nationality = user.nationality ?? '';
      });
      this.userservice.getpersonalinfobyid(this.user_id).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.res = res;

          // Check each property for undefined and replace it with an empty string if necessary
          for (let prop in this.res) {
            if (this.res.hasOwnProperty(prop) && this.res[prop] === undefined) {
              this.res[prop] = '';
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
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  updateUser(): void {
    Swal.fire({
      title: 'Confirmez Vos Informations',
      html: `
        <div>
          <div style="font-size:1.2rem"> Êtes-vous sûr de vouloir soumettre <br> vos informations personnelles ?  </div> 
          <div style="color:#a8a3a3;margin-top:5px"">Veuillez vérifier que toutes les données <br> saisies sont correctes et à jour.</div>
        </div>
      `,

      background: '#fefcf1',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      confirmButtonColor: "#91c593",
      cancelButtonText: 'Annuler',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUserInfo = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          location: this.location,
          nationality: this.nationality
        };
        // User clicked 'Yes', call the endpoint
        this.userservice.updateUser(this.user_id, updatedUserInfo).subscribe({
          next: (res) => {
            // Handle success
            Swal.fire({
              title: 'Succès',
              text: 'Profil mise à jour avec succès !',
              background: '#fefcf1',
              confirmButtonColor: "#91c593",
            });
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            Swal.fire({
              title: 'Erreur',
              text: "Aucune modification n'a été apportée.",
              background: '#fefcf1',
              confirmButtonColor: "#91c593",
            });
          }
        });
      } else {
        // User clicked 'Cancel' or closed the popup
        Swal.fire({
          title: 'Annulé',
          text: "Aucune modification n'a été apportée.",
          background: '#fefcf1',
          confirmButtonColor: "#91c593",
        });
      }
    });
  }

  changePassword(): void {
    Swal.fire({
      title: 'Confirmez Vos Informations',
      html: `
        <div>
          <div style="font-size:1.2rem"> Êtes-vous sûr de vouloir soumettre <br> vos informations personnelles ?  </div> 
          <div style="color:#a8a3a3;margin-top:5px"">Veuillez vérifier que toutes les données <br> saisies sont correctes et à jour.</div>
        </div>
      `,

      background: '#fefcf1',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      confirmButtonColor: "#91c593",
      cancelButtonText: 'Annuler',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.newPassword !== this.confirmPassword) {
          // Display an error message or handle the mismatch scenario
          console.error('Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas');
          Swal.fire({
            title: 'Erreur',
            text: "Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas",
            confirmButtonColor: "#91c593",
            background: '#fefcf1',
          });
        }
        else {
          const passwordData = {
            password: this.currentPassword,
            new_password: this.newPassword
          };

          // Call the service to update password
          this.userservice.updatepassword(this.user_id, passwordData).subscribe({
            next: (res) => {
              // Handle success
              Swal.fire({

                title: 'Succès',
                text: 'Mot de passe mise à jour avec succès !',
                background: '#fefcf1',
                confirmButtonColor: "#91c593",
              });
            },
            error: (e) => {
              // Handle errors
              console.error(e);
              Swal.fire({
                title: 'Erreur',
                text: "Aucune modification n'a été apportée " + e.error.error
                ,

                background: '#fefcf1',
                confirmButtonColor: "#91c593",
              });
            }
          });
        }

      } else {
        // User clicked 'Cancel' or closed the popup
        Swal.fire({
          title: 'Annulé',
          text: "Aucune modification n'a été apportée.",
          icon: 'info',
          confirmButtonColor: "#91c593",
        });
      }
    });



  }
}
