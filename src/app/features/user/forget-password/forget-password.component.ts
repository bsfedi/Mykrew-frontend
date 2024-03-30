import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  email: any;

  constructor(private userService: UserService, private router: Router) { }

  forgetPassword() {
    const data = { email: this.email };
    this.userService.forgot_password(data).subscribe(
      response => {
        console.log('Password reset email sent successfully');
        Swal.fire('Success', 'Un email de réinitialisation de mot de passe a été envoyé!', 'success');
      },
      error => {
        console.error('Error sending password reset email:', error);
        if (error.status === 500) { // Check for specific error status code
          Swal.fire('Error', 'Une erreur s\'est produite lors de l\'envoi de l\'email de réinitialisation de mot de passe.', 'error');
        } else {
          // Handle other types of errors or network issues here
          // You can display a generic error message or implement additional error handling logic
          Swal.fire('Error', 'Une erreur s\'est produite lors de l\'envoi de l\'email de réinitialisation de mot de passe.', 'error');
        }
      }
    );
  }
  gotosingin() {
    this.router.navigate([clientName + '/sign-up']);
  }
  gotosinguup() {
    this.router.navigate([clientName + '/sign-up']);
  }
}
