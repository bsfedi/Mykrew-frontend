import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';

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
  hideMissions: boolean = false;
  currentDate: Date | undefined;
  items: any;
  showPopup: boolean = false;
  showPopup1: boolean = false;
  closestEndDate: any | null;
  isMenuOpen: boolean[] = [];
  isMenuOpen1: boolean[] = []
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
  constructor(private consultantservice: ConsultantService, private fb: FormBuilder, private router: Router, private datePipe: DatePipe) {
    // Ensure that the items array is correctly populated here if needed.

    this.getCurrentDate();



    this.myForm1 = this.fb.group({

      craPdf: ['', Validators.required],
      // Add other form controls as needed
    });

    this.myForm = this.fb.group({
      TJM: ['', Validators.required],
      userDocument: ['', Validators.required],
      // Add other form controls as needed
    });
  }
  getCurrentDate() {
    this.currentDate = new Date();
    console.log(this.currentDate);

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
          console.log(this.items);

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
            const client = mission.clientInfo.clientContact.firstName;
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
    console.log(this.hideMissions);

  }
  click() {
    this.router.navigate(['/consultant/new-mission']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  toggleMenu1(i: number) {
    this.isMenuOpen1[i] = !this.isMenuOpen1[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate(['/consultant/details-mission/' + _id])
  }
  gotocra(_id: string) {
    this.router.navigate(['/CRA/' + _id])
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
        }
      });

  }
  submit(): void {
    const token = localStorage.getItem('token');

    if (token && this.selectedFile) {

      console.log(this.formData);


      // formData.append('simulation', this.selectedFile);
      this.formData.append('valueOfNewTjm', this.myForm.value.TJM);
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
          }
        });
    }
  }
}
