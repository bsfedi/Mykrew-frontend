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
  colors: any
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
  date: string = 'year'
  public chartOptions: Partial<ChartOptions> | any;
  user_id: any
  res: any
  stats: any
  constructor(private userservice: UserService, private consultantservice: ConsultantService, private fb: FormBuilder, private router: Router) {
    // Ensure that the items array is correctly populated here if needed.
    this.user_id = localStorage.getItem('user_id')
    this.consultantservice.virementstatusbar(this.user_id).subscribe({

      next: (res) => {
        this.stats = res
        console.error(this.stats, "45445454454");
        const customColors: string[] = ['#FCE9A4', '#C8E1C3',] // Replace with your desired colors

        this.chartOptions = {
          series: [
            {
              name: this.stats.series[0].name,
              data: this.stats.series[0].data,
            },
            {
              name: this.stats.series[1].name,
              data: this.stats.series[1].data,
            },
            // Add more series if needed
          ],
          chart: {

            height: 250,
            type: "area",
            // Background color
          },
          colors: ['#FCE9A4', '#C8E1C3'],  // Line colors
          stroke: {
            width: 2,
            curve: "smooth",
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            type: "date",
            categories: this.stats.categories

          },
        };
      },
      error: (e) => {
        if (e.status == 404) {
          console.error(e, "45445454454");
          this.stats.series[0].name = []
          this.stats.series[0].data = []
          this.stats.series[1].name = []
          this.stats.series[1].data = []
          this.stats.categories = []
          this.chartOptions = {
            series: [
              {
                name: this.stats.series[0].name,
                data: this.stats.series[0].data,
              },
              {
                name: this.stats.series[1].name,
                data: this.stats.series[1].data,
              },
              // Add more series if needed
            ],
            chart: {

              height: 250,
              type: "area",
              // Background color
            },
            colors: ['#FCE9A4', '#C8E1C3'],  // Line colors
            stroke: {
              width: 2,
              curve: "smooth",
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              type: "date",
              categories: this.stats.categories

            },
          };
        }



        // Set loading to false in case of an error
      }
    });




  }
  ngOnInit(): void {

    this.userservice.getMyvirements(this.user_id).subscribe({
      next: (res) => {
        // Sort the response array by createdAt in ascending order
        this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);

        this.res = this.res.map((item: any) => ({
          ...item,
          createdAt: this.formatDate(item.createdAt),
        }));
      },
      error: (e) => {
        console.error(e);
        // Set loading to false in case of an error
      }
    });



  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  getmyvir() {

    this.userservice.getMyvirements(this.user_id).subscribe({
      next: (res) => {
        // Sort the response array by createdAt in ascending order
        this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);

        this.res = this.res.map((item: any) => ({
          ...item,
          createdAt: this.formatDate(item.createdAt),
        }));
      },
      error: (e) => {
        console.error(e);
        // Set loading to false in case of an error
      }
    });
  }
  filterByType(selectedType: any) {
    if (selectedType == 'all') {
      this.res = this.getmyvir();
    } else {
      this.userservice.filter_by_type(selectedType).subscribe({
        next: (res: any[]) => { // Explicitly specify the type as an array
          // Sort the filtered response array by createdAt in descending order
          this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);
          this.res = this.res.map((item: any) => ({
            ...item,
            createdAt: this.formatDate(item.createdAt),
          }));
        }
      } as any); // Add 'as any' to suppress TypeScript errors
    }
  }



  virementByPeriod() {
    this.userservice.virementByPeriod(this.date, this.user_id).subscribe({
      next: (res: any[]) => { // Assuming res is an array of objects
        // Sort the response array by createdAt in descending order
        this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);
        this.res = this.res.map((item: any) => ({
          ...item,
          createdAt: this.formatDate(item.createdAt),
        }));
      },
    } as any);
  }


}
