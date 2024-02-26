import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
declare const PDFObject: any;

import { environment } from 'src/environments/environment';
const baseUrl = `${environment.baseUrl}`;


@Component({
  selector: 'app-cra-mission',
  templateUrl: './cra-mission.component.html',
  styleUrls: ['./cra-mission.component.css']
})
export class CraMissionComponent {
  currentYear: number | any;

  currentMonth: number | any;
  currentDate: Date | any;
  daysInMonth: number[] | any;
  emptyStartDays: number[] | any;
  emptyEndDays: number[] | any;
  selectedDays: { day: number; month: number }[] = [];

  fileInputs: any = {};
  selectedFile: any
  mission_id: any
  permis_img: any
  headers: any
  mission_details: any
  daysDifference: any
  formData = new FormData();
  noteGlobale: string = '';
  isAgendaReadOnly: boolean = true;
  cradetails: any
  pdfData: any
  isLoading: any
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


  constructor(private consultantservice: ConsultantService, private inscriptionservice: InscriptionService, private route: ActivatedRoute) { }

  selectDay(day: any): void {
    if (!this.isAgendaReadOnly) {
      const index = this.selectedDays.findIndex(selection => selection.day === day && selection.month === this.currentMonth);

      if (index === -1) {
        this.selectedDays.push({ day, month: this.currentMonth });
        console.log(this.selectedDays);
      } else {
        this.selectedDays.splice(index, 1);
        console.log(this.selectedDays);
      }
    }
  }

  isSelected(day: number): boolean {
    return this.selectedDays.some(selection => selection.day === day && selection.month === this.currentMonth);
  }

  ngOnInit(): void {

    const token = localStorage.getItem('token');
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.mission_id = params['id'];
    });


    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.consultantservice.getUserMissionById(this.mission_id, this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server
          this.mission_details = res
          // Assuming mission_details is declared in your component
          let startDate = new Date(this.mission_details.missionInfo.startDate);
          let endDate = new Date(this.mission_details.missionInfo.endDate);
          // Calculate the difference in milliseconds
          let timeDifference = endDate.getTime() - startDate.getTime();

          // Calculate the difference in days
          this.daysDifference = timeDifference / (1000 * 3600 * 24);


        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });

    }

    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonth = this.currentDate.getMonth();
    this.generateCalendar(this.currentYear, this.currentMonth);
    this.getcra()
    this.markSelectedDays();
    this.consultantservice.getcrabymissionid(this.mission_id).subscribe({
      next: (res) => {

        // Handle the response from the server
        this.cradetails = res
        this.cradetails.craInformation.signature = baseUrl + "uploads/" + this.cradetails.craInformation.signature
        this.selectedDays = this.cradetails.craInformation.selectedDates
        this.cradetails.craInformation.craPDF[0].filename = baseUrl + "uploads/" + this.cradetails.craInformation.craPDF[0].filename



        this.inscriptionservice.getPdf(this.cradetails.craInformation.craPDF[0].filename).subscribe({
          next: (res) => {
            this.pdfData = res;
            this.isLoading = false;
            if (this.pdfData) {
              this.handleRenderPdf(this.pdfData);
            }
          },
        });


      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }

  handleRenderPdf(data: any) {

    const pdfObject = PDFObject.embed(data, '#pdfContainer');


  }
  getcra() {
    this.consultantservice.getcrabymissionid(this.mission_id).subscribe({
      next: (res) => {

        // Handle the response from the server
        this.cradetails = res
        console.log(this.cradetails.craInformation);

        this.cradetails.craInformation.signature = baseUrl + "uploads/" + this.cradetails.craInformation.signature
        console.log(this.cradetails);

        this.selectedDays = this.cradetails.craInformation.selectedDates
        console.log(this.selectedDays);


      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  generateCalendar(year: number, month: number): void {
    this.daysInMonth = [];
    this.emptyStartDays = [];
    this.emptyEndDays = [];

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
      this.emptyStartDays.push(i);
    }

    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      this.daysInMonth.push(i);
    }

    const lastDayOfMonth = new Date(year, month, numberOfDaysInMonth).getDay();
    for (let i = lastDayOfMonth + 1; i < 7; i++) {
      this.emptyEndDays.push(i);
    }
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentMonth === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  onMonthChange(): void {
    this.generateCalendar(this.currentYear, this.currentMonth);
  }


  updatemoncre() {
    console.log(this.selectedDays);

    const user_id = localStorage.getItem('user_id')
    this.formData.append('selectedDates', JSON.stringify(this.selectedDays));
    this.formData.append('noteGlobale', this.noteGlobale);
    this.consultantservice.updateCra(this.mission_id, this.formData).subscribe({
      next: (res) => {
        // Handle success
        console.log(res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }

  setFileInput(field: string, event: any): void {
    const user_id = localStorage.getItem('user_id')
    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'signature') {
          this.permis_img = e.target!.result as string;
          const signature = this.fileInputs.signature.files[0];


          // Append the files if they exist, else append empty strings
          this.formData.append('signature', signature);




        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  markSelectedDays(): void {
    // Use fakeSelectedDays for testing
    this.selectedDays = this.selectedDays;

    this.selectedDays.forEach(selectedDay => {
      const dayElement = document.getElementById(`day-${selectedDay.day}`);
      if (dayElement) {
        dayElement.classList.add('selected-day');
      }
    });
  }
}
