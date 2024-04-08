import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this line
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
const clientName = `${environment.default}`;
@Component({
  standalone: true,
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css'],
  imports: [CommonModule]
})
export class LeftBarComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
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
  isActiveRoute(route: string): boolean {
    return this.route.snapshot.url.join('/') === route;
  }


  gottodashboard() {
    this.router.navigate([clientName + '/dashboard'])
  }
  gotomission() {
    this.router.navigate([clientName + '/consultant/missions'])

  }
  gotovirment() {
    this.router.navigate([clientName + '/consultant/virements'])

  }
  gottoallcras() {
    this.router.navigate([clientName + '/allcras'])
  }
  goinfopersot() {
    this.router.navigate([clientName + '/consultant/infoperso'])
  }
  gomyprofil() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  goallConsultants() {
    this.router.navigate([clientName + '/allConsultants'])
  }
  gototjm() {
    this.router.navigate([clientName + '/tjmrequests'])

  }
  gotomembres() {
    this.router.navigate([clientName + '/members'])

  }
  role: any
  showmenu_consultant = false
  ngOnInit(): void {
    this.role = localStorage.getItem('role')
    if (this.role == 'CONSULTANT') {
      this.showmenu_consultant = true


    }

  }
  clearLocalStorage() {
    Swal.fire({
      title: 'Confirmer les modifications',
      html: `
        <div>
        <div style="font-size:1.2rem;">  Êtes-vous sûr de vouloir <br>déconnecter de ce compte ? </div> 
        </div>
      `,
      iconColor: '#1E1E1E',
      background: '#fefcf1',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      confirmButtonColor: "#91c593",
      cancelButtonText: 'Non',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {

        localStorage.clear();
        this.router.navigate([clientName + '/sign-in'])
        // User clicked 'Yes', call the endpoint

      }
    });

  }
}

