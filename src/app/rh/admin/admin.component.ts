import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  all_rh: any
  showPopup: any
  myForm: FormGroup;
  all_users: any
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = [];
  res: any
  constructor(private inscriptionservice: InscriptionService, private consultantservice: ConsultantService, private router: Router, private userservice: UserService, private socketService: WebSocketService, private fb: FormBuilder) {
    this.myForm = this.fb.group({

      email: ['', Validators.required],
      password: ['', Validators.required],
      immat: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // Add other form controls as needed
    });
  }

  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');
    this.userservice.getpersonalinfobyid(user_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.res = res
        console.log('inffffffffoooooo', this.res);
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    this.consultantservice.getallrh().subscribe({
      next: (res) => {
        this.all_rh = res

      }, error(e) {
        console.log(e);

      }
    });
    this.consultantservice.getConsultantusers().subscribe({
      next: (res) => {
        this.all_users = res

      }, error(e) {
        console.log(e);

      }
    });

  }
  deleteconsultant(id: any) {
    Swal.fire({
      title: "Confirmez l'action",
      background: '#fefcf1',
      html: `
        <div>
        <div style="font-size:1.2rem"> Êtes-vous sûr de vouloir supprimer ce compte ?  </div> 
          
        </div>
      `,
      iconColor: '#1E1E1E',
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
        // User clicked 'Yes', call the endpoint
        this.consultantservice.deleteconsultant(id).subscribe({
          next: (res) => {
            Swal.fire('Success', 'le consultant supprimé avec succes', 'success');

            // Handle the response from the server
            console.log(res);
            window.location.reload();
            // Additional logic if needed
          },
          error: (e) => {
            // Handle errors
            console.error(e);
          },
        });
      } else {
        Swal.fire({
          background: '#fefcf1',
          title: 'Annulé',
          text: "Aucune modification n'a été apportée.",
          iconColor: '#1E1E1E',

          confirmButtonText: 'Ok',
          confirmButtonColor: "#91c593",
        })
        // // User clicked 'Cancel' or closed the popup
        // Swal.fire('Annulé',
        //   "Aucune modification n'a été apportée.", 'info');
      }
    });

  }
  gotocdashboad() {

    this.router.navigate([clientName + '/allConsultants'])

  }
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page
  currentPageconsultant = 1; // Current page
  totalPages: any;
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.all_rh.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.all_rh.length);


    return this.all_rh.slice(startIndex, endIndex);



  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getDisplayedconsultants(): any[] {

    this.totalPages = Math.ceil(this.all_users.length / this.pageSize);
    const startIndex = (this.currentPageconsultant - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.all_users.length);


    return this.all_users.slice(startIndex, endIndex);



  }

  nextPageconsultant() {
    if (this.currentPageconsultant < this.totalPages) {
      this.currentPageconsultant++;
    }
  }

  previousPageconsultant() {
    if (this.currentPageconsultant > 1) {
      this.currentPageconsultant--;
    }
  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  toggleMenu1(i: number) {
    this.isMenuOpen1[i] = !this.isMenuOpen1[i];
  }
  gotomissions(_id: string) {
    this.router.navigate([clientName + '/missions/' + _id])
  }
  openPopup(): void {
    this.showPopup = true;
  }
  closePopup(): void {
    this.showPopup = false;

  }

  add_userrh() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `${token}`);
      this.consultantservice.addrhuser(this.myForm.value, headers).subscribe({
        next: (res) => {
          Swal.fire('Success', 'Utilisateur ajouté avec succès!', 'success');
          this.showPopup = false;
          // Handle the response from the server
          console.log(res);
          window.location.reload();
          // Additional logic if needed
        },
        error: (e) => {
          // Handle errors
          console.error(e);
        },
      });
    }
  }
  updateAccountVisibility(id: any, activated: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    console.log(id);

    const data: any = {
      "activated": activated
    }
    this.consultantservice.updateAccountVisibility(id, data, headers).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Compte desactivé avec succès!', 'success');
        this.showPopup = false;
        window.location.reload();
        // Handle the response from the server
        console.log(res);
        // Additional logic if needed
      },
      error: (e) => {
        // Handle errors
        console.error(e);
      },
    });
  }
  updateUserByAdmin(id: any, activated: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    console.log(id);

    const data: any = {
      "activated": activated
    }
    this.consultantservice.updateUserByAdmin(id, data, headers).subscribe({
      next: (res) => {
        Swal.fire('Success', 'Compte desactivé avec succès!', 'success');
        this.showPopup = false;
        window.location.reload();
        // Handle the response from the server
        console.log(res);
        // Additional logic if needed
      },
      error: (e) => {
        // Handle errors
        console.error(e);
      },
    });
  }


}
