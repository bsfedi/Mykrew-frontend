import { Component } from '@angular/core';
import { ConsultantService } from 'src/app/services/consultant.service';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-virement',
  templateUrl: './virement.component.html',
  styleUrls: ['./virement.component.css']
})
export class VirementComponent {
  token :any
  headers :any
  user_id : any
  virements :any
  

  constructor(private consultantservice: ConsultantService, private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.user_id = params['id'];
    });

    this.token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `${this.token}`);
    
    this.consultantservice.getallvirements().subscribe(
      (response) => {
          this.virements = response
        // Add any additional handling or notifications if needed
      },
      (error) => {
        console.error('Error getting virement:', error);
        // Handle the error or display an error message
      }
    );
  }


}
