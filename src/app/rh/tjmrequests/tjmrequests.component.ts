import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';

@Component({
  selector: 'app-tjmrequests',
  templateUrl: './tjmrequests.component.html',
  styleUrls: ['./tjmrequests.component.css']
})
export class TjmrequestsComponent {
  token :any
  headers :any
  user_id : any
  tjmrequests :any
  formData: { typeVirement: string; montant: string } = { typeVirement: '', montant: '' };
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = []
  constructor(private consultantservice: ConsultantService, private route:ActivatedRoute,private router : Router) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.user_id = params['id'];
    });

    this.token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `${this.token}`);
    
    this.consultantservice.getAllTjmRequest().subscribe(
      (response) => {
          this.tjmrequests = response
          console.log(this.tjmrequests);
          
        // Add any additional handling or notifications if needed
      },
      (error) => {
        console.error('Error getting virement:', error);
        // Handle the error or display an error message
      }
    );
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate(['/validated-tjmrequests/' + _id])
  }
  onFormSubmit() {

    const formData = {
      // Extract form data as needed (e.g., fullName, companyName)
      // Example:
     
      
      userId: this.user_id,
      typeVirement: this.formData.typeVirement,
      montant: this.formData.montant,
      // Add other form data here
    };

    this.consultantservice.createvirement(formData).subscribe(
      (response) => {
        console.log('Virement created successfully:', response);
        // Add any additional handling or notifications if needed
      },
      (error) => {
        console.error('Error creating virement:', error);
        // Handle the error or display an error message
      }
    );
  }
}
