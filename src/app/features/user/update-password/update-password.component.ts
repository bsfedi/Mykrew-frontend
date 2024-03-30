import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent {
  newPassword: any
  user_id: any
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.user_id = params['user_id']; // Get user_id from route parameters
    });
  }
  updatePassword() {

    const data = { "newPassword": this.newPassword };
    this.userService.updatePassword(this.user_id, data).subscribe(
      response => {
        console.log('Password updated successfully');
        Swal.fire('Success', 'Password updated successfully!', 'success');
      },
      error => {
        console.error('Error updating password:', error);
        Swal.fire('Error', 'An error occurred while updating the password.', 'error');
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
