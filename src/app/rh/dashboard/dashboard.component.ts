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
  headers: any
  clientValidation: any
  contactClient: any
  nbdemande: any
  contractValidation: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions>;
  constructor(private inscriptionservice: InscriptionService, private fb: FormBuilder, private router: Router) {
    // Ensure that the items array is correctly populated here if needed.
    this.chartOptions = {
      series: [
        {

          data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
        },

      ],

      chart: {
        height: 200,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#EAE3D5"],
      xaxis: {
        type: "datetime",
        categories: [
          "1/11/2000",
          "2/11/2000",
          "3/11/2000",
          "4/11/2000",
          "5/11/2000",
          "6/11/2000",
          "7/11/2000",
          "8/11/2000",
          "9/11/2000",
          "10/11/2000",
          "11/11/2000",
          "12/11/2000",
          "1/11/2001",
          "2/11/2001",
          "3/11/2001",
          "4/11/2001",
          "5/11/2001",
          "6/11/2001"
        ]
      },



    };
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');



    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.inscriptionservice.getPendingPreregisters(this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server

          console.log(res);

          this.items = res
          this.nbdemande = this.items.length
          console.log(this.nbdemande);





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
  }
  click() {
    this.router.navigate(['/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate(['/validation/' + _id])
  }
  gotomissions(_id: string) {
    this.router.navigate(['/missions/' + _id])
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
  gotovalidemission(id: any) {
    this.router.navigate(['/validationmission/' + id])
  }
  gottoallConsultants() {
    this.router.navigate(['/allConsultants'])
  }


}
