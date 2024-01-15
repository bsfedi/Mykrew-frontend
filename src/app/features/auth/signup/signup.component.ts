import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  succesmessage = '';
  failedmessage = ''
  showerrormessage = false
  showsucessmessage = false

  constructor(private userservice: UserService, private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  saveUser(): void {
    // Mark all fields as touched if the form is pristine
    if (this.signupForm.pristine) {
      this.signupForm.markAllAsTouched();
      return; // Prevent form submission if it's still pristine
    }

    if (this.signupForm.valid) {
      console.log(this.signupForm.value.confirmPassword, this.signupForm.value.password);

      if (this.signupForm.value.confirmPassword != this.signupForm.value.password) {
        this.showerrormessage = true
        this.showsucessmessage = false
        this.failedmessage = "Passwords do not match."
        console.log(this.failedmessage);

      }
      else {
        const data = {
          email: this.signupForm.value.email,
          password: this.signupForm.value.password
        };

        this.userservice.create(data).subscribe({
          next: (res) => {
            this.succesmessage = "Your account created successfully"
            this.showerrormessage = false
            this.showsucessmessage = true
            this.router.navigate(['/sign-in']);
            console.log(this.succesmessage);

          },
          error: (e) => {
            this.failedmessage = e.error.message
            this.showerrormessage = true
            this.showsucessmessage = false
            console.error(e.error.message)
          }


        });
      }
    } else {
      // Handle invalid form submission, display error messages, etc.
      console.log('Form is invalid');
    }
  }
}