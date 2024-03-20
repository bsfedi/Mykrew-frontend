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
import { DatePipe } from '@angular/common';


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
  show_chart: boolean = false
  constructor(private userservice: UserService, private consultantservice: ConsultantService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe) {
    // Ensure that the items array is correctly populated here if needed.
    this.user_id = localStorage.getItem('user_id')
    this.consultantservice.virementstatusbar(this.user_id).subscribe({

      next: (res) => {
        this.stats = res
        if (this.stats.series[0].name) {
          this.show_chart = true
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
        else {
          this.stats.series[0].name = []
          this.stats.series[0].data = []
          this.stats.series[1].name = []
          this.stats.series[1].data = []
          this.stats.categories = []
          this.chartOptions = {
            series: [
              {
                name: [],
                data: [],
              },
              {
                name: [],
                data: [],
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


      }
    },
    );




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
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  filterByType(selectedType: string, date: any) {

    this.userservice.virementByPeriod(this.user_id, selectedType, date).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          // Sort the filtered response array by createdAt in descending order
          this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
          this.res = this.res.map((item: any) => ({
            ...item,
            createdAt: this.formatDate(item.createdAt),
          }));
        } else {
          // Handle case when response is empty
          this.res = [];
        }
      },
      error: (err) => {
        this.res = [];
        console.error('Error occurred while fetching data:', err);
        // Handle error gracefully
      }
    });

  }




  // virementByPeriod() {
  //   this.userservice.virementByPeriod(this.date, this.user_id).subscribe({
  //     next: (res: any[]) => { // Assuming res is an array of objects
  //       // Sort the response array by createdAt in descending order
  //       this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);
  //       this.res = this.res.map((item: any) => ({
  //         ...item,
  //         createdAt: this.formatDate(item.createdAt),
  //       }));
  //     },
  //   } as any);
  // }


}
