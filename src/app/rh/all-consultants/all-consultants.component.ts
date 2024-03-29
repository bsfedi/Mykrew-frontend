import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';

import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
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
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ConsultantService } from 'src/app/services/consultant.service';
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
  selector: 'app-all-consultants',
  templateUrl: './all-consultants.component.html',
  styleUrls: ['./all-consultants.component.css']
})
export class AllConsultantsComponent {
  selectedItem: string | null = null;
  items: any[] = [];
  sortDirection: 'asc' | 'desc' = 'asc'; // Initial sorting direction
  sortDirectionAlpha: 'A-Z' | 'Z-A' = 'A-Z'
  sortType: 'date' | 'alpha' = 'date'; // Initial sorting type
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
  stats: any
  cardstats: any
  process_statut: any
  @ViewChild("chart") chart: ChartComponent | any;
  searchTerm: any
  shownotiff: boolean = false
  filteredItems: any[] = [];
  res: any
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  notification: string[] = [];
  constructor(private inscriptionservice: InscriptionService, private userservice: UserService, private datePipe: DatePipe, private consultantservice: ConsultantService, private socketService: WebSocketService, private fb: FormBuilder, private router: Router) {




  }
  shownotif() {

    this.shownotiff = !this.shownotiff
  }
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page
  totalPages: any;
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.filteredItems.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredItems.length);


    return this.filteredItems.slice(startIndex, endIndex);



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
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id')
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
    if (token) {
      this.consultantservice.getRhNotificationsnotseen().subscribe({
        next: (res1) => {
          this.nblastnotifications = res1.length
          this.lastnotifications = res1

        },
        error: (e) => {
          // Handle errors
          this.nblastnotifications = 0
          console.error(e);
          // Set loading to false in case of an error

        }
      });
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
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);

      this.getpreregister()

      this.consultantservice.getConsultantStats().subscribe({
        next: (res) => {
          // Handle the response from the server

          this.cardstats = res







        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }

  }
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }

  getpreregister() {
    this.inscriptionservice.getvalidatedPreregisters(this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
        this.nbdemande = res.length; // Assuming res is an array

        // Update this.items with the response
        this.items = res;
        this.filteredItems = this.items
        // Iterate through each item in this.items
        for (let item of this.items) {

          this.consultantservice.getContaractById(item.contractProcess, this.headers).subscribe({
            next: (contractRes) => {
              // Set the process_status for the current item
              item.process_status = contractRes.statut;
            },
            error: (e) => {
              console.error(e);
              // Handle error for individual contract retrieval
              // You may want to set a default value for process_status or handle this error differently
            }
          });
          this.consultantservice.getuserinfomation(item.userId, this.headers).subscribe({
            next: (user) => {
              console.log(user);

              // Set the process_status for the current item
              item.isAvtivated = user.isAvtivated;


            },
            error: (e) => {
              console.error(e);
              // Handle error for individual contract retrieval
              // You may want to set a default value for process_status or handle this error differently
            }
          });
        }
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error
      }
    });
  }
  resetFilter() {
    this.selectedItem = 'reset';
    this.searchTerm = ''; // Reset the search term
    this.sortDirection = 'asc'; // Reset sorting direction for date
    this.sortType = 'date'; // Reset sorting type to date
    this.sortDirectionAlpha = 'A-Z'; // Reset sorting direction for alphabetical order
    this.sortItems(); // Apply default sorting
    this.getpreregister()

  }
  toggleMenu1() {
    this.isMenuOpen1 = !this.isMenuOpen1;
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
    this.selectedItem = type;

    // If it's a new sorting type, reset the direction to ascending
    if (this.sortType !== type) {
      this.sortType = type;
      this.sortDirection = 'asc';
      // Reset sorting direction for alphabetical order
      if (type === 'alpha') {
        this.sortDirectionAlpha = 'A-Z';
      }
    } else { // If it's the same sorting type, toggle the direction
      if (type === 'date') {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else if (type === 'alpha') {
        // Toggle sorting direction for alphabetical order
        this.sortDirectionAlpha = this.sortDirectionAlpha === 'A-Z' ? 'Z-A' : 'A-Z';
      }
    }

    // Call the sorting function
    this.sortItems();
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
      if (this.sortDirectionAlpha === 'A-Z') { // Check the sorting direction for alphabetical order
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      } else { // If sorting direction is Z-A
        if (nameA < nameB) {
          return 1; // Reverse the comparison
        }
        if (nameA > nameB) {
          return -1; // Reverse the comparison
        }
        return 0;
      }
    });
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
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
  click() {
    this.router.navigate([clientName + '/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/validation/' + _id])
  }
  gotomissions(_id: string) {
    this.router.navigate([clientName + '/missions/' + _id])
  }

  gotocdashboad() {

    this.router.navigate([clientName + '/dashboard'])

  }
  openPopup(): void {
    this.showPopup = true;
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
  gotovalidemission(id_mission: any, id: any) {
    this.router.navigate([clientName + '/validationmission/' + id_mission + '/' + id])
  }
  gottoallConsultants() {
    this.router.navigate([clientName + '/dashboard'])
  }
}
