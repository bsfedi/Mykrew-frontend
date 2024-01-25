import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this line
import { Router } from '@angular/router';

@Component({
  standalone : true ,
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css'],
  imports: [CommonModule]
})
export class LeftBarComponent {
  constructor(private router: Router) {
    document.addEventListener("DOMContentLoaded", function () {
      const menuToggle = document.querySelector(".menu-toggle") as HTMLElement;
      const firstItem = document.querySelector(".first-item") as HTMLElement;
    
      if (menuToggle && firstItem) {
        menuToggle.addEventListener("click", function () {
          // Toggle the class to show/hide the navigation bar
          firstItem.classList.toggle("collapsed");
    
          // Adjust the margin-left of the first item
          if (firstItem.classList.contains("collapsed")) {
            firstItem.style.marginLeft = "-30px";
            
          } else {
            firstItem.style.marginLeft = "-270px";
            
          }
        });
      }
    });
    
    
    
  }


  gotomission() {
    this.router.navigate(['/consultant/missions'])

  }
  gotovirment() {
    this.router.navigate(['/consultant/virements'])

  }

  goinfopersot() {
    this.router.navigate(['/consultant/infoperso'])
  }
  goallConsultants() {
    this.router.navigate(['/allConsultants'])
  }
  gototjm(){
    this.router.navigate(['/tjmrequests'])
    
  }
  role :any
  showmenu_consultant = false
  ngOnInit(): void {
    this.role = localStorage.getItem('role') 
    if (this.role == 'CONSULTANT'){
      this.showmenu_consultant =true
      
      
    }
     
  }
  
}

