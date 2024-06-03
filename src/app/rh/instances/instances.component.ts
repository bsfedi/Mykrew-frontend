import { HttpClient, HttpHeaders } from '@angular/common/http';
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
const baseUrl = "http://152.228.135.170:5200/"
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  chart1: ApexChart | any;
  xaxis: ApexXAxis | any;
  dataLabels: ApexDataLabels | any;
  grid: ApexGrid | any;
  fill: ApexFill | any;
  markers: ApexMarkers | any;
  yaxis: ApexYAxis | any;
  stroke: ApexStroke | any;
  title: ApexTitleSubtitle | any;
  colors: any
};

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.css']
})

export class InstancesComponent {


  all_rh: any
  showPopup: any
  myForm: FormGroup;
  all_users: any
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = [];
  res: any

  show: any
  public chartOptions: Partial<ChartOptions> | any;
  constructor(private inscriptionservice: InscriptionService, private consultantservice: ConsultantService, private router: Router, private userservice: UserService, private http: HttpClient, private fb: FormBuilder) {
    this.myForm = this.fb.group({

      email: ['', Validators.required],
      password: ['', Validators.required],
      immat: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // Add other form controls as needed
    });


    this.show = true
    const customColors: string[] = ['#FCE9A4'] // Replace with your desired colors

    this.chartOptions = {
      series: [
        {

          data: ["1240", "240", "360", "3200", "420", "6/2024", "7/2024", "8/2024", "9/2024", "10/2024", "11/2024", "12/2024"]
        },

        // Add more series if needed
      ],
      chart: {
        toolbar: {
          show: true, // Show or hide the toolbar
          tools: {
            download: true, // Show or hide the download option in the toolbar
            selection: true, // Show or hide the selection tool in the toolbar
            zoom: false, // Show or hide the zoom tool in the toolbar
            zoomin: true, // Show or hide the zoom in button in the toolbar
            zoomout: true, // Show or hide the zoom out button in the toolbar
            pan: false, // Show or hide the pan tool in the toolbar
            reset: true, // Show or hide the reset zoom button in the toolbar
            customIcons: [] // Custom icons for the toolbar, e.g., [{icon: 'image-url', click: function() { // Custom action }}]
          },
          autoSelected: 'zoom' // Automatically select the tool on chart render, options: 'zoom', 'pan', 'selection', null
        },
        animations: {
          enabled: true, // Enable or disable animations
          easing: 'easeout', // Easing function for animations, options: 'linear', 'easein', 'easeout', 'easeinout', etc.
          speed: 800, // Animation speed in milliseconds
          animateGradually: {
            enabled: true, // Enable or disable gradual animation for chart updates
            delay: 150 // Delay in milliseconds between each data point animation
          },
          dynamicAnimation: {
            enabled: true, // Enable or disable dynamic animation for chart updates
            speed: 300 // Animation speed in milliseconds for dynamic animations
          }
        },
        height: 250,
        type: "area",
        // Background color
      },
      colors: ['#FCE9A4', '#C8E1C3'],  // Line colors
      stroke: {

        curve: "smooth",
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: "date",
        categories: ["1/2024", "2/2024", "3/2024", "4/2024", "5/2024", "6/2024", "7/2024", "8/2024", "9/2024", "10/2024", "11/2024", "12/2024"]

      },
    };
  }


  nb_instancess: any
  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');
    this.userservice.getpersonalinfobyid(user_id).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.res = res
        this.show = true
        console.log('inffffffffoooooo', this.res);
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });


    this.get_entreprises().subscribe({
      next: (res) => {

        this.all_users = res
        console.log(this.all_users);


      }, error(e) {
        console.log(e);

      }
    });
    this.nb_instances().subscribe({
      next: (res: any) => {

        this.nb_instancess = res
        console.log(this.all_users);


      }, error(e: any) {
        console.log(e);

      }
    });
  }
  get_entreprises() {

    return this.http.get(baseUrl + 'get_entreprises')

  }
  nb_instances() {

    return this.http.get(baseUrl + 'nb_instances')

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

