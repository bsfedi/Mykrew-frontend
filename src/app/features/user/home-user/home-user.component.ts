import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent {
  headers: any
  items: any
  constructor(private router: Router, private consultantservice: ConsultantService) {

  }


  gotomission() {
    this.router.navigate([clientName + '/consultant/missions'])

  }
  gotovirment() {
    this.router.navigate([clientName + '/consultant/virements'])

  }

  goinfopersot() {
    this.router.navigate([clientName + '/consultant/infoperso'])
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');



    // Check if token is available
    if (token) {
      console.log(token);

      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.getMyMissions(this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server


          this.items = res

          console.log(this.items[0]);






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


