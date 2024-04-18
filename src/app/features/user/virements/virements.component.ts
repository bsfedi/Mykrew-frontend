import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const clientName = `${environment.default}`;
const baseUrl = `${environment.baseUrl}`;
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
import { WebSocketService } from 'src/app/services/web-socket.service';


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
  constructor(private userservice: UserService, private consultantservice: ConsultantService, private socketService: WebSocketService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe) {
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
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  pdfcontainer1: any
  notification: string[] = [];
  res1: any
  pageSize = 8; // Number of items per page
  currentPage = 1; // Current page
  totalPages: any;
  res2: any
  shownotiff: boolean = false
  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  gotoallnotification() {
    this.router.navigate([clientName + '/consultant/allnotifications'])
  }
  shownotif() {

    this.shownotiff = !this.shownotiff
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
    this.consultantservice.getallnotification(user_id).subscribe({
      next: (res1) => {
        this.res1 = res1
        this.nblastnotifications = this.res1.length
        this.lastnotifications = this.res1

      },
      error: (e) => {
        this.nblastnotifications = 0
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    this.userservice.getpersonalinfobyid(this.user_id).subscribe({


      next: (res) => {
        // Handle the response from the server
        this.res2 = res
        console.log('inffffffffoooooo', this.res);






      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    this.userservice.getMyvirements(this.user_id).subscribe({
      next: (res) => {
        if (res.length > 0) {
          // Sort the response array by createdAt in ascending order
          this.res = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);

          this.res = this.res.map((item: any) => ({
            ...item,
            createdAt: this.formatDate(item.createdAt),
          }));
        }
        else {
          this.res = []
        }


      },
      error: (e) => {

        console.error("eeeeeeeeeeeeeeeeeeee", e);
        // Set loading to false in case of an error
      }
    });



  }
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.res.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.res.length);


    return this.res.slice(startIndex, endIndex);
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
