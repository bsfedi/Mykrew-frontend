import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';

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
import { UserService } from 'src/app/services/user.service';


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
};

@Component({
  selector: 'app-virements',
  templateUrl: './virements.component.html',
  styleUrls: ['./virements.component.css']
})
export class VirementsComponent {
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
  selectedType: string = 'all';
  date : string = 'today'
  public chartOptions: Partial<ChartOptions>;
  user_id :any
  res : any 
  constructor(private userservice: UserService, private fb: FormBuilder, private router: Router) {
    // Ensure that the items array is correctly populated here if needed.
    this.user_id = localStorage.getItem('user_id')

    this.chartOptions = {
      series: [
        {

          data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
        },

      ],

      chart: {
        height: 250,
        type: "line"
      },
      stroke: {
        width: 1,
        curve: "smooth"
      },
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
    
      this.userservice.getMyvirements(this.user_id).subscribe({
  
  
        next: (res) => {
          // Handle the response from the server
          this.res = res
          console.log(this.res);
  
        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error
  
        }
      });
    
  }

  filterByType(){
    
    this.userservice.filter_by_type(this.selectedType).subscribe({
  
  
      next: (res) => {
        // Handle the response from the server
        this.res = res
        console.log(this.res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }

  virementByPeriod(){
    
    this.userservice.virementByPeriod(this.date).subscribe({
  
  
      next: (res) => {
        // Handle the response from the server
        this.res = res
        console.log(this.res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }

}
