import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";
import { ConsultantService } from 'src/app/services/consultant.service';
import { DatePipe } from '@angular/common';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { UserService } from 'src/app/services/user.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  dataLabels: ApexDataLabels | any;
  yaxis: ApexYAxis | any;
  colors: string[] | any;
  legend: ApexLegend | any;
  fill: ApexFill | any;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  items: any;
  showPopup: boolean = false;
  showPopup1: boolean = false;
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean = false;
  headers: any
  clientValidation: any
  contactClient: any
  nbdemande: any
  contractValidation: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  cardstats: any
  stats: any
  searchTerm: any
  sortDirection: 'asc' | 'desc' = 'asc'; // Initial sorting direction
  sortDirectionAlpha: 'A-Z' | 'Z-A' = 'A-Z'
  sortType: 'date' | 'alpha' = 'date'; // Initial sorting type
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  notification: string[] = [];
  filteredItems: any[] = [];
  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions>;
  res: any
  showfilterbar: any;
  constructor(private inscriptionservice: InscriptionService, private datePipe: DatePipe, private socketService: WebSocketService, private userservice: UserService, private fb: FormBuilder, private consultantservice: ConsultantService, private router: Router) {
    this.chartOptions = {}
    this.consultantservice.getMonthlyStatsForAllUsers().subscribe({
      next: (res) => {
        this.stats = res
        console.log(this.stats.series[0].data);

        this.chartOptions = {
          series: [
            {

              data: this.stats.series[0].data
            },

          ],

          chart: {
            height: 200,
            type: "area",

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

          },
          dataLabels: {
            enabled: false
          },
          colors: ["#EAE3D5"],
          xaxis: {
            type: "category",
            categories: this.stats.categories,
          },



        };




      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  gotocdashboad() {

    this.router.navigate(['/allConsultants'])

  }
  gotovalidemission(id_mission: any, id: any) {
    this.router.navigate(['/validationmission/' + id_mission + '/' + id])
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');

    this.new_notif = localStorage.getItem('new_notif');

    this.socketService.connect()
    // Listen for custom 'rhNotification' event in WebSocketService
    this.socketService.onRhNotification().subscribe((event: any) => {
      console.log(event);

      if (event.notification.toWho == "RH") {
        this.lastnotifications.push(event.notification.typeOfNotification)
        this.nblastnotifications = this.lastnotifications.length
        this.notification.push(event.notification.typeOfNotification)
        localStorage.setItem('new_notif', 'true');
      }

      // Handle your rhNotification event here
    });
    // Check if token is available
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
    this.consultantservice.getRhNotificationsnotseen().subscribe({
      next: (res1) => {
        this.nblastnotifications = res1.length
        this.lastnotifications = res1

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });

    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.getConsultantStats().subscribe({
        next: (res) => {
          // Handle the response from the server
          this.getdemandes()
          this.cardstats = res







        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }
    this.sortItems(); // Call the sorting function
  }

  getdemandes() {
    this.inscriptionservice.getPendingPreregisters(this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server

        console.log(res);

        this.items = res
        this.nbdemande = this.items.length
        this.filteredItems = this.items






      },
      error: (e) => {
        // Handle errors
        // You can handle different status codes here
        if (e.status === 404) {
          this.items = []
          this.nbdemande = 0
        }

        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  click() {
    this.router.navigate(['/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  toggleMenu1() {
    this.isMenuOpen1 = !this.isMenuOpen1;
  }
  gotovalidation(_id: string) {
    this.router.navigate(['/validation/' + _id])
  }
  gotomissions(_id: string) {
    this.router.navigate(['/missions/' + _id])
  }
  resetFilter() {
    this.searchTerm = ''; // Reset the search term
    this.sortDirection = 'asc'; // Reset sorting direction for date
    this.sortType = 'date'; // Reset sorting type to date
    this.sortDirectionAlpha = 'A-Z'; // Reset sorting direction for alphabetical order
    this.sortItems(); // Apply default sorting
    this.getdemandes()
  }
  openPopup(): void {
    this.showPopup = true;
  }
  showfilter() {
    this.showfilterbar = true
  }
  openPopup1(id: any): void {


    this.inscriptionservice.getContaractByPrerigister(id, this.headers).subscribe({
      next: (res) => {

        this.getContaractByPrerigister = res
        console.log(res);

        // Handle the response from the server
        this.idcontractByPreregister = res._id
        if (res.clientValidation == "VALIDATED") {
          this.clientValidation = true
        }
        else {
          this.clientValidation = false
        }
        if (res.contactClient == "VALIDATED") {
          this.contactClient = true
        }
        else {
          this.contactClient = false
        }
        if (res.contractValidation == "VALIDATED") {
          this.contractValidation = true
        }
        else {
          this.contractValidation = false
        }
        if (res.jobCotractEdition == "VALIDATED") {
          this.jobCotractEdition = true
        }
        else {
          this.jobCotractEdition = false
        }







      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    this.showPopup1 = true;
  }
  closePopup(): void {
    this.showPopup = false;

  }
  closePopup1(): void {
    this.showPopup1 = false;

  }
  validatePriseDeContact(id: any, contactClient: any): void {
    console.log(id);

    const data = {
      "validated": contactClient
    }
    console.log(data);

    this.inscriptionservice.validatePriseDeContact(id, data, this.headers).subscribe({
      next: (res) => {
        console.log(res);

        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateClientValidation(id: any, clientValidation: any): void {
    const data = {
      "validated": clientValidation
    }
    this.inscriptionservice.validateClientValidation(id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateJobCotractEdition(id: any, jobCotractEdition: any): void {
    const data = {
      "validated": jobCotractEdition
    }
    console.log(data);

    this.inscriptionservice.validateJobCotractEdition(id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  gotomyprofile() {
    this.router.navigate(['/edit-profil'])
  }
  gotoallnotification() {
    this.router.navigate(['/consultant/allnotifications'])
  }
  applyFilter() {
    // Check if search term is empty
    if (this.searchTerm.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.items;
    } else {
      // Apply filter based on search term
      this.filteredItems = this.items.filter((item: any) =>
        item.personalInfo.firstName.value.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.personalInfo.lastName.value.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  toggleSortDirection(type: any) {
    if (this.sortType !== type) {
      this.sortType = type;
      this.sortDirection = 'asc'; // Reset sorting direction if changing sorting type
      if (type === 'alpha') {
        this.sortDirectionAlpha = 'A-Z'; // Reset sorting direction for alphabetical order
      }
    } else {
      if (type === 'date') {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'; // Toggle sorting direction for date
      } else if (type === 'alpha') {
        this.sortDirectionAlpha = this.sortDirectionAlpha === 'A-Z' ? 'Z-A' : 'A-Z'; // Toggle sorting direction for alpha
      }
    }
    this.sortItems(); // Call the sorting function
  }

  sortItems() {
    if (this.sortType === 'date') {
      this.sortItemsByDate();
    } else if (this.sortType === 'alpha') {
      this.sortItemsByAlpha();
    }
  }

  sortItemsByDate() {
    this.items.sort((a: any, b: any) => {
      const timeDiff = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
      return this.sortDirection === 'asc' ? timeDiff : -timeDiff; // Reverse sorting direction if 'desc'
    });
  }

  sortItemsByAlpha() {
    this.items.sort((a: any, b: any) => {
      const nameA = a.personalInfo.firstName.value.toUpperCase(); // Convert to uppercase for case-insensitive comparison
      const nameB = b.personalInfo.firstName.value.toUpperCase();
      if (nameA < nameB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (nameA > nameB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  exportTable() {
    // Select the table element
    const table = document.querySelector('table');

    // Check if table is not null
    if (table) {
      // Get the table rows
      const rows = Array.from(table.querySelectorAll('tr'));

      // Create an array to store the row data
      const rowData = [];

      // Get the header row
      const headerRow = rows[0];

      // Get the cells within the header row
      const headerCells = Array.from(headerRow.querySelectorAll('th'));

      // Get the header cell content and add it to the rowData array
      const headerRowDataItem = headerCells.map(cell => cell.innerText.trim());
      rowData.push(headerRowDataItem.join(','));

      // Iterate over each row (starting from the second row to exclude the header)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowDataItem: any[] = [];

        // Get the cells within the row
        const cells = Array.from(row.querySelectorAll('td'));

        // Iterate over each cell
        cells.forEach(cell => {
          // Add cell content to rowDataItem array
          rowDataItem.push(cell.innerText.trim());
        });

        // Add rowDataItem array to rowData array
        rowData.push(rowDataItem.join(','));
      }

      // Convert rowData array to CSV string
      const csvString = rowData.join('\n');

      // Create a Blob object containing the CSV data
      const blob = new Blob([csvString], { type: 'text/csv' });

      // Create a temporary anchor element to trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('style', 'display: none;');
      a.href = url;
      a.download = 'table_data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      // Handle the case when the table is not found
      console.error('Table element not found');
    }
  }
  validateContractValidation(id: any, contractValidation: any): void {
    const data = {
      "validated": contractValidation
    }
    console.log(data);

    this.inscriptionservice.validateContractValidation(id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }

  gottoallConsultants() {
    this.router.navigate(['/allConsultants'])
  }


}
