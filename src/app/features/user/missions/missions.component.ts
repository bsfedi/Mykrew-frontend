import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
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
import Swal from 'sweetalert2';

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
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent {
  hideMissions: boolean = true;
  currentDate: Date | undefined;
  items: any;
  showPopup: boolean = false;
  showPopup1: boolean = false;
  closestEndDate: any | null;
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = []
  isMenuOpen2: boolean[] = []
  headers: any
  clientValidation: any
  contactClient: any
  nbdemande: any
  contractValidation: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  pending_missions: any;
  validated_mission: any;
  NotValidated_mission: any;
  daysDiff: any
  clientofcurrentmission: any
  tjmofcurrentmission: any
  datamissions: any[] = []
  categories: any[] = []
  formattedDate: any
  @ViewChild("chart") chart: ChartComponent | any;
  chartOptions: Partial<ChartOptions> | any;
  fileInputs: any = {}; // Initialize fileInputs object
  document: string | null = null; // Initialize document property
  selectedFile: any
  myForm: FormGroup;
  user_id: any
  mission_id: any
  formData = new FormData();
  myForm1: FormGroup;
  tjm_moyen: any
  stats: any;
  cra: string | null = null;
  deposer: any;
  show_chart: boolean = false
  constructor(private consultantservice: ConsultantService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe) {
    // Ensure that the items array is correctly populated here if needed.

    this.getCurrentDate();



    this.myForm1 = this.fb.group({

      craPdf: ['', Validators.required],
      // Add other form controls as needed
    });

    this.myForm = this.fb.group({
      TJM: ['', Validators.required],
      datecompte: ['', Validators.required],
      userDocument: ['', Validators.required],
      // Add other form controls as needed
    });
  }


  getCurrentDate() {
    this.currentDate = new Date();
    console.log(this.currentDate);

  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  isDateAfterToday(dateToCompare: any): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight
    const comparisonDate = this.parseDate(dateToCompare);
    comparisonDate.setHours(0, 0, 0, 0); // Set time to midnight
    return comparisonDate > currentDate;
  }

  isDateBeforeToday(dateToCompare: any): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight
    const comparisonDate = this.parseDate(dateToCompare);
    comparisonDate.setHours(0, 0, 0, 0); // Set time to midnight


    return comparisonDate < currentDate;

  }
  deposercra(id: any) {
    this.deposer = true
    this.mission_id = id
  }
  isDateToday(dateToCompare: any): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight
    const comparisonDate = this.parseDate(dateToCompare);
    comparisonDate.setHours(0, 0, 0, 0); // Set time to midnight
    return comparisonDate.toDateString() === currentDate.toDateString();
  }

  private parseDate(dateToParse: any): Date {
    // Check if the date is already in the 'Dec 30 2023' format
    if (typeof dateToParse === 'string' && dateToParse.match(/^[a-zA-Z]{3} \d{1,2} \d{4}$/)) {
      return new Date(dateToParse);
    }

    // Assume it's in the 'YYYY-MM-DD' format
    return new Date(dateToParse);
  }

  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id')
    this.consultantservice.virementstatusbar(this.user_id).subscribe({

      next: (res) => {
        this.stats = res
        const customColors: string[] = ['#FCE9A4', '#C8E1C3',] // Replace with your desired colors

        // Generate fake data for the chart
        const generateFakeData = (length: any) => {
          const currentDate = new Date();
          const startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - length);

          const fakeData = [];
          for (let i = 0; i < length; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            fakeData.push(date.toISOString());
          }

          return fakeData;
        };

        // Generate fake series data
        const generateFakeSeriesData = (length: any) => {
          const fakeData = [];
          for (let i = 0; i < length; i++) {
            fakeData.push(Math.floor(Math.random() * 100));
          }
          return fakeData;
        };

        // Set the number of data points you want
        const numberOfDataPoints = 10;
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
      },
      error: (e) => {
        console.error(e);
        // Set loading to false in case of an error
      }
    });
    const token = localStorage.getItem('token');

    this.user_id = localStorage.getItem('user_id');

    // Check if token is available
    if (token) {
      console.log(token);

      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.getMyMissions(this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server


          this.items = res
          this.nbdemande = this.items.length






        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });

      this.consultantservice.getPendingMissions(this.headers).subscribe({


        next: (res) => {


          const latestStartDate = new Date(
            Math.max(
              ...res.map((mission: any) =>
                new Date(mission.missionInfo.startDate.value).getTime()
              )
            )
          );

          this.pending_missions = res.map((mission: any) => {
            const missionStartDate = new Date(mission.missionInfo.startDate.value);

            // Compare the mission start date with the latest start date
            if (missionStartDate.getTime() === latestStartDate.getTime()) {
              // If the mission start date is the latest, set status to "nouvelle"
              mission.status = "nouvelle";
            } else {
              // If the mission start date is not the latest, set status to "ancienne"
              mission.status = "ancienne";
            }

            return mission;
          });
          console.log(this.pending_missions);

        },
        error: (e) => {
          // Handle errors
          this.pending_missions = []
          console.error(e);
          // Set loading to false in case of an error
        }
      });

      this.consultantservice.getValidatedMissions(this.headers).subscribe({
        next: (res) => {
          this.validated_mission = res;

          // Initialize variables for calculating average daily rate
          let totalDailyRate = 0;
          let numberOfMissions = this.validated_mission.length;

          // Find the closest end date
          const currentDate = new Date();
          let closestEndDate: Date | null = null;
          let closestDiff: number = Infinity;

          this.validated_mission.forEach((mission: any) => {
            this.datamissions.push(mission.missionInfo.dailyRate * 20);

            // Calculate the total daily rate
            totalDailyRate += mission.missionInfo.dailyRate;

            const parsedDate = new Date(mission.missionInfo.endDate.split('T')[0]);
            this.formattedDate = this.datePipe.transform(parsedDate, 'M/d/yyyy');

            this.categories.push(this.formattedDate);

            const endDate = new Date(mission.missionInfo.endDate);
            const client = mission.clientInfo.company;
            const tjm = mission.missionInfo.dailyRate;
            const timeDiff = endDate.getTime() - currentDate.getTime();

            if (timeDiff >= 0 && timeDiff < closestDiff) {
              closestEndDate = endDate;
              closestDiff = timeDiff;
              this.clientofcurrentmission = client;
              this.tjmofcurrentmission = tjm;
            }
          });

          // Calculate the average daily rate
          this.tjm_moyen = numberOfMissions > 0 ? totalDailyRate / numberOfMissions : 0;

          if (closestEndDate !== null) {
            // Format closestEndDate as "YYYY-MM-DD"
            this.closestEndDate = (closestEndDate as Date).toISOString().split('T')[0];

            // Calculate the number of days between today and closestEndDate
            this.daysDiff = Math.round(closestDiff / (1000 * 60 * 60 * 24));

            // Use the calculated average daily rate as needed
            console.log('Average Daily Rate:', this.tjm_moyen);
          } else {
            // Handle the case where no valid end date is found
            this.closestEndDate = '';
            this.daysDiff = '';
            this.clientofcurrentmission = '';
            this.tjmofcurrentmission = '';
          }
        },
        error: (e) => {
          // Handle errors
          this.validated_mission = [];
          console.error(e);

          // Set loading to false in case of an error
        },
      });

      this.consultantservice.getNotValidatedMissions(this.headers).subscribe({
        next: (res) => {
          if (res.length != 0) {
            this.NotValidated_mission = res
            console.log(this.NotValidated_mission);


          } else {
            this.NotValidated_mission = []
            console.log(this.NotValidated_mission.length);

          }

          console.log(this.NotValidated_mission);



        },
        error: (e) => {
          // Handle errors
          console.error(e);

          this.NotValidated_mission = []

          // Set loading to false in case of an error

        }
      });

    }
  }

  toggleHide() {
    this.hideMissions = !this.hideMissions;


  }
  pageSize = 5; // Number of items per page
  currentPage = 1; // Current page

  totalPages: any;
  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.validated_mission.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.validated_mission.length);


    return this.validated_mission.slice(startIndex, endIndex);



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


  pageSizepending = 5; // Number of items per page
  currentPagepending = 1; // Current page
  totalPagespending: any = 1;
  getDisplayeddocspending(): any[] {


    this.totalPages = Math.ceil(this.pending_missions.length / this.pageSizepending);
    const startIndex = (this.currentPagepending - 1) * this.pageSizepending;
    const endIndex = Math.min(startIndex + this.pageSizepending, this.pending_missions.length);


    return this.pending_missions.slice(startIndex, endIndex);



  }

  nextPagepending() {
    if (this.currentPagepending < this.totalPagespending) {
      this.currentPagepending++;
    }
  }

  previousPagepending() {
    if (this.currentPagepending > 1) {
      this.currentPagepending--;
    }
  }



  pageSizenv = 5; // Number of items per page
  currentPagenv = 1; // Current page

  totalPagesnv: any = 1;
  getDisplayeddocsnv(): any[] {


    this.totalPagesnv = Math.ceil(this.NotValidated_mission.length / this.pageSizenv);
    const startIndex = (this.currentPagenv - 1) * this.pageSizenv;
    const endIndex = Math.min(startIndex + this.pageSizenv, this.NotValidated_mission.length);


    return this.NotValidated_mission.slice(startIndex, endIndex);



  }

  nextPagenv() {
    if (this.currentPagenv < this.totalPagesnv) {
      this.totalPagesnv++;
    }
  }

  previousPagenv() {
    if (this.currentPagenv > 1) {
      this.currentPagenv--;
    }
  }

  click() {
    this.router.navigate([clientName + '/consultant/new-mission']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  toggleMenu1(i: number) {
    this.isMenuOpen1[i] = !this.isMenuOpen1[i];
  }
  toggleMenu2(i: number) {
    this.isMenuOpen2[i] = !this.isMenuOpen2[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/consultant/details-mission/' + _id])
  }
  gotocra(_id: string) {
    this.router.navigate([clientName + '/CRA/' + _id])
  }
  openPopup(id: any): void {
    this.showPopup = true;
    this.mission_id = id
  }
  openPopup1(): void {
    this.showPopup1 = true;
  }
  closePopup(): void {
    this.showPopup = false;

  }
  closePopup1(): void {
    this.showPopup1 = false;

  }
  idpdf: any
  setFileInput(field: string, event: any): void {
    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'document') {

          this.document = e.target!.result as string;

          const document = this.fileInputs.document.files[0];
          // Append the files if they exist, else append empty strings
          this.formData.append('isSimulationValidated', document);
          if (document.name.endsWith('.pdf')) {
            this.idpdf = true
          } else {
            this.idpdf = false
          }

        }
        else if (field == 'cra') {


          this.cra = e.target!.result as string;


          const cra = this.fileInputs.cra.files[0];

          console.log(cra);

          // Append the files if they exist, else append empty strings
          this.formData.append('craPdf', cra);


        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submitcra() {
    this.consultantservice.addCraPdfToUser(this.mission_id, this.formData)
      .subscribe({
        next: (res) => {
          Swal.fire('Success', "votre cra ajouté avec succès!", 'success');
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: 'cra ajouté avec succès!',
            showConfirmButton: false,
            timer: 1500
          });
          this.deposer = false
          // Handle the response from the server
          console.log(res);
          // Additional logic if needed
        },
        error: (e) => {
          // Handle errors
          console.error(e);
          Swal.fire('Error', e.error.error, 'error');
        }
      });

  }
  submit(): void {
    const token = localStorage.getItem('token');

    if (token && this.selectedFile) {

      console.log(this.formData);


      // formData.append('simulation', this.selectedFile);
      this.formData.append('valueOfNewTjm', this.myForm.value.TJM);
      this.formData.append('datecompte', this.myForm.value.datecompte);
      this.formData.append('userId', this.user_id)
      this.formData.append('missionId', this.mission_id)



      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.createTjmRequest(this.formData)
        .subscribe({
          next: (res) => {
            Swal.fire('Success', "TJM ajouté avec succès!", 'success');
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: 'TJM ajouté avec succès!',
              showConfirmButton: false,
              timer: 1500
            });
            this.showPopup = false
            // Handle the response from the server
            console.log(res);
            // Additional logic if needed
          },
          error: (e) => {
            // Handle errors
            console.error(e);
            Swal.fire('Error', e.error.message);
          }
        });
    }
  }
}
