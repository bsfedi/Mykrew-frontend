import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';

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
  constructor(private inscriptionservice: InscriptionService, private consultantservice: ConsultantService, private userservice: UserService, private socketService: WebSocketService, private fb: FormBuilder) {
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
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  toggleMenu1(i: number) {
    this.isMenuOpen1[i] = !this.isMenuOpen1[i];
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
        Swal.fire('Success', 'compte desactivé avec succès!', 'success');
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
        Swal.fire('Success', 'compte desactivé avec succès!', 'success');
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
