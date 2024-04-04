import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { ActivatedRoute, Route, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import Swal from 'sweetalert2';

declare let html2pdf: any
import { jsPDF } from "jspdf";
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;

@Component({
  selector: 'app-cra',
  templateUrl: './cra.component.html',
  styleUrls: ['./cra.component.css']
})
export class CRAComponent {
  @ViewChild('myPdfContent') myPdfContent!: ElementRef;
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
  myinfo: any;
  mission_details: any
  daysDifference: any
  formData = new FormData();
  noteGlobale: string = '';
  dowloded: any
  portage: any
  months: string[] = [
    'Janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  @ViewChild('fileInput') fileInput: ElementRef | any;
  @ViewChild('fileInputdrivinglicence') fileInputdiving: ElementRef | any;
  @ViewChild('fileInputdib') fileInputdib: ElementRef | any;
  openFileInput() {
    // Trigger click event on the hidden file input
    this.fileInput.nativeElement.click();
  }
  constructor(private consultantservice: ConsultantService, private route: ActivatedRoute, private inscriptionservice: InscriptionService, private userservice: UserService, private router: Router) { }
  // fakeSelectedDays: { day: number; month: number }[] = [
  //   { day: 17, month: 0 },
  //   { day: 21, month: 0 },
  //   { day: 23, month: 0 }
  // ];
  selectDay(day: any): void {
    // Check if the day is already selected for the current month
    const index = this.selectedDays.findIndex(selection => selection.day === day && selection.month === this.currentMonth);

    if (index === -1) {
      // If not selected, add it to the array with the current month
      this.selectedDays.push({ day, month: this.currentMonth });


    } else {
      // If already selected, remove it from the array
      this.selectedDays.splice(index, 1);

    }
  }

  isSelected(day: number): boolean {
    return this.selectedDays.some(selection => selection.day === day && selection.month === this.currentMonth);
  }
  generatePdf() {
    this.initializeDaysInMonth(this.currentYear, this.currentMonth);
    const pdf = new jsPDF();
    let currentDate = new Date();
    let formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    const imageSrc = this.permis_img;
    // Create your HTML content as a string
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Poppins', sans-serif !important;
            }
            .custom-class {
              color: red;
            }
            table {
              border-collapse: collapse;
              width: 130%;
            }
            th, td {
              height : 1px;
              padding: 1px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div style="display:flex;">
          <div>
            <b> ${this.months[this.currentMonth]} ${this.currentYear} - ${this.myinfo.firstName} ${this.myinfo.lastName} </b>
      
            <div style='width: 16.875rem;
                  height: 5.0625rem;
                flex-shrink: 0;
                padding: 8px;
                border-radius: 0.4375rem;
                border: 1px solid #ECECEE;'>
                <svg style='margin-top:2px;' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 7.33301H8.66671V4.66634C8.66671 4.48953 8.59647 4.31996 8.47145 4.19494C8.34642 4.06991 8.17686 3.99967 8.00004 3.99967C7.82323 3.99967 7.65366 4.06991 7.52864 4.19494C7.40362 4.31996 7.33338 4.48953 7.33338 4.66634V7.99967C7.33338 8.17649 7.40362 8.34605 7.52864 8.47108C7.65366 8.5961 7.82323 8.66634 8.00004 8.66634H10C10.1769 8.66634 10.3464 8.5961 10.4714 8.47108C10.5965 8.34605 10.6667 8.17649 10.6667 7.99967C10.6667 7.82286 10.5965 7.65329 10.4714 7.52827C10.3464 7.40325 10.1769 7.33301 10 7.33301ZM8.00004 1.33301C6.6815 1.33301 5.39257 1.724 4.29624 2.45654C3.19991 3.18909 2.34543 4.23028 1.84085 5.44845C1.33626 6.66663 1.20424 8.00707 1.46148 9.30028C1.71871 10.5935 2.35365 11.7814 3.286 12.7137C4.21835 13.6461 5.40624 14.281 6.69944 14.5382C7.99265 14.7955 9.33309 14.6635 10.5513 14.1589C11.7694 13.6543 12.8106 12.7998 13.5432 11.7035C14.2757 10.6071 14.6667 9.31822 14.6667 7.99967C14.6647 6.23217 13.9617 4.53762 12.7119 3.2878C11.4621 2.03798 9.76755 1.33497 8.00004 1.33301ZM8.00004 13.333C6.94521 13.333 5.91406 13.0202 5.037 12.4342C4.15994 11.8481 3.47635 11.0152 3.07269 10.0407C2.66902 9.06611 2.5634 7.99376 2.76919 6.95919C2.97498 5.92463 3.48293 4.97432 4.22881 4.22844C4.97469 3.48256 5.925 2.97461 6.95956 2.76882C7.99413 2.56303 9.06648 2.66865 10.041 3.07232C11.0156 3.47598 11.8485 4.15957 12.4345 5.03663C13.0206 5.91369 13.3334 6.94484 13.3334 7.99967C13.3318 9.41366 12.7693 10.7693 11.7695 11.7691C10.7696 12.769 9.41404 13.3314 8.00004 13.333Z" fill="#1E1E1E"/>
                </svg> Temps de travail <br>
                <div style='margin:15px'>
                <b>${this.selectedDays.length} jours </b>
                </div> 
            </div> <br> <br><br>
            <div style='width: 16.875rem;
                height: 12.1875rem;
                flex-shrink: 0;
                padding: 8px;
                border-radius: 0.4375rem;
                border: 1px solid #ECECEE;'>
                <svg style='margin-top:2px;' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M14.25 4.875H12V4.125C12 3.52826 11.7629 2.95597 11.341 2.53401C10.919 2.11205 10.3467 1.875 9.75 1.875H8.25C7.65326 1.875 7.08097 2.11205 6.65901 2.53401C6.23705 2.95597 6 3.52826 6 4.125V4.875H3.75C3.15326 4.875 2.58097 5.11205 2.15901 5.53401C1.73705 5.95597 1.5 6.52826 1.5 7.125V13.875C1.5 14.4717 1.73705 15.044 2.15901 15.466C2.58097 15.8879 3.15326 16.125 3.75 16.125H14.25C14.8467 16.125 15.419 15.8879 15.841 15.466C16.2629 15.044 16.5 14.4717 16.5 13.875V7.125C16.5 6.52826 16.2629 5.95597 15.841 5.53401C15.419 5.11205 14.8467 4.875 14.25 4.875ZM7.5 4.125C7.5 3.92609 7.57902 3.73532 7.71967 3.59467C7.86032 3.45402 8.05109 3.375 8.25 3.375H9.75C9.94891 3.375 10.1397 3.45402 10.2803 3.59467C10.421 3.73532 10.5 3.92609 10.5 4.125V4.875H7.5V4.125ZM15 13.875C15 14.0739 14.921 14.2647 14.7803 14.4053C14.6397 14.546 14.4489 14.625 14.25 14.625H3.75C3.55109 14.625 3.36032 14.546 3.21967 14.4053C3.07902 14.2647 3 14.0739 3 13.875V9.75C3.73158 10.0402 4.48364 10.2758 5.25 10.455V10.8975C5.25 11.0964 5.32902 11.2872 5.46967 11.4278C5.61032 11.5685 5.80109 11.6475 6 11.6475C6.19891 11.6475 6.38968 11.5685 6.53033 11.4278C6.67098 11.2872 6.75 11.0964 6.75 10.8975V10.74C7.49576 10.8415 8.24737 10.8941 9 10.8975C9.75263 10.8941 10.5042 10.8415 11.25 10.74V10.8975C11.25 11.0964 11.329 11.2872 11.4697 11.4278C11.6103 11.5685 11.8011 11.6475 12 11.6475C12.1989 11.6475 12.3897 11.5685 12.5303 11.4278C12.671 11.2872 12.75 11.0964 12.75 10.8975V10.455C13.5164 10.2758 14.2684 10.0402 15 9.75V13.875ZM15 8.1075C14.2705 8.41537 13.5183 8.66612 12.75 8.8575V8.625C12.75 8.42609 12.671 8.23532 12.5303 8.09467C12.3897 7.95402 12.1989 7.875 12 7.875C11.8011 7.875 11.6103 7.95402 11.4697 8.09467C11.329 8.23532 11.25 8.42609 11.25 8.625V9.18C9.75844 9.40503 8.24156 9.40503 6.75 9.18V8.625C6.75 8.42609 6.67098 8.23532 6.53033 8.09467C6.38968 7.95402 6.19891 7.875 6 7.875C5.80109 7.875 5.61032 7.95402 5.46967 8.09467C5.32902 8.23532 5.25 8.42609 5.25 8.625V8.8725C4.48172 8.68112 3.72945 8.43037 3 8.1225V7.125C3 6.92609 3.07902 6.73532 3.21967 6.59467C3.36032 6.45402 3.55109 6.375 3.75 6.375H14.25C14.4489 6.375 14.6397 6.45402 14.7803 6.59467C14.921 6.73532 15 6.92609 15 7.125V8.1075Z" fill="#1E1E1E"/>
                </svg> Prestataire <br>
                <div style='margin:15px'> <b>${this.myinfo.firstName}  </b></div>
                <b> Date: ${formattedDate}  <b> <b style='margin-left:45px'> Signature :  <img style='margin-left:155px' src="${imageSrc}" alt="Selected Image" width="30%" height="30%" /> </b> <br>
            </div>

            <div style='width: 16.875rem;
                height: 12.1875rem;
                padding: 8px;
                flex-shrink: 0;
                border-radius: 0.4375rem;
                border: 1px solid #ECECEE;'>
                <svg style="margin-top:2px" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M9.33337 5.33301H10C10.1769 5.33301 10.3464 5.26277 10.4714 5.13775C10.5965 5.01272 10.6667 4.84315 10.6667 4.66634C10.6667 4.48953 10.5965 4.31996 10.4714 4.19494C10.3464 4.06991 10.1769 3.99967 10 3.99967H9.33337C9.15656 3.99967 8.98699 4.06991 8.86197 4.19494C8.73695 4.31996 8.66671 4.48953 8.66671 4.66634C8.66671 4.84315 8.73695 5.01272 8.86197 5.13775C8.98699 5.26277 9.15656 5.33301 9.33337 5.33301ZM9.33337 7.99967H10C10.1769 7.99967 10.3464 7.92944 10.4714 7.80441C10.5965 7.67939 10.6667 7.50982 10.6667 7.33301C10.6667 7.1562 10.5965 6.98663 10.4714 6.8616C10.3464 6.73658 10.1769 6.66634 10 6.66634H9.33337C9.15656 6.66634 8.98699 6.73658 8.86197 6.8616C8.73695 6.98663 8.66671 7.1562 8.66671 7.33301C8.66671 7.50982 8.73695 7.67939 8.86197 7.80441C8.98699 7.92944 9.15656 7.99967 9.33337 7.99967ZM6.00004 5.33301H6.66671C6.84352 5.33301 7.01309 5.26277 7.13811 5.13775C7.26314 5.01272 7.33337 4.84315 7.33337 4.66634C7.33337 4.48953 7.26314 4.31996 7.13811 4.19494C7.01309 4.06991 6.84352 3.99967 6.66671 3.99967H6.00004C5.82323 3.99967 5.65366 4.06991 5.52864 4.19494C5.40361 4.31996 5.33337 4.48953 5.33337 4.66634C5.33337 4.84315 5.40361 5.01272 5.52864 5.13775C5.65366 5.26277 5.82323 5.33301 6.00004 5.33301ZM6.00004 7.99967H6.66671C6.84352 7.99967 7.01309 7.92944 7.13811 7.80441C7.26314 7.67939 7.33337 7.50982 7.33337 7.33301C7.33337 7.1562 7.26314 6.98663 7.13811 6.8616C7.01309 6.73658 6.84352 6.66634 6.66671 6.66634H6.00004C5.82323 6.66634 5.65366 6.73658 5.52864 6.8616C5.40361 6.98663 5.33337 7.1562 5.33337 7.33301C5.33337 7.50982 5.40361 7.67939 5.52864 7.80441C5.65366 7.92944 5.82323 7.99967 6.00004 7.99967ZM14 13.333H13.3334V1.99967C13.3334 1.82286 13.2631 1.65329 13.1381 1.52827C13.0131 1.40325 12.8435 1.33301 12.6667 1.33301H3.33337C3.15656 1.33301 2.98699 1.40325 2.86197 1.52827C2.73695 1.65329 2.66671 1.82286 2.66671 1.99967V13.333H2.00004C1.82323 13.333 1.65366 13.4032 1.52864 13.5283C1.40361 13.6533 1.33337 13.8229 1.33337 13.9997C1.33337 14.1765 1.40361 14.3461 1.52864 14.4711C1.65366 14.5961 1.82323 14.6663 2.00004 14.6663H14C14.1769 14.6663 14.3464 14.5961 14.4714 14.4711C14.5965 14.3461 14.6667 14.1765 14.6667 13.9997C14.6667 13.8229 14.5965 13.6533 14.4714 13.5283C14.3464 13.4032 14.1769 13.333 14 13.333ZM8.66671 13.333H7.33337V10.6663H8.66671V13.333ZM12 13.333H10V9.99967C10 9.82286 9.9298 9.65329 9.80478 9.52827C9.67975 9.40324 9.51018 9.33301 9.33337 9.33301H6.66671C6.4899 9.33301 6.32033 9.40324 6.1953 9.52827C6.07028 9.65329 6.00004 9.82286 6.00004 9.99967V13.333H4.00004V2.66634H12V13.333Z" fill="#1E1E1E"/>
              </svg>Client <br> 
              <div style='margin:15px'> <b>${this.mission_details.clientInfo.company}  </b></div>
              <b> Date:<b> <b style='margin-left:45px'> Signature : </b> <br>
            </div>
          </div>
          <div style="margin-left:50px">
          <table>
          
            <tr  >
              <td>Jour</td>
              
              <td>Durée</td>
            </tr>
          
            <tbody>
            ${this.daysInMonth
        .map((day: any) => `
                <tr style="background-color: ${day.duree === 0 ? '#F5F5F5' : ''}">
                  <td style="width:150px">${day.dayOfWeek} . ${day.day} </td>
          
                  <td>${day.duree}</td>
                </tr>
              `)
        .join('')}
          </tbody>
        </table>
   
          </div>
          </div>
        </body>
      </html>
    `;
    this.dowloded = true
    html2pdf(htmlContent, {
      margin: 10,
      filename: 'cra_' + formattedDate + '_' + this.myinfo.firstName + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },

    }).pdf.save('document.pdf'), this.router.navigate([clientName + '/consultant/missions']);



  }


  initializeDaysInMonth(year: number, month: number) {
    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = Array.from({ length: numberOfDaysInMonth }, (_, index) => {
      const day = index + 1;
      const dayOfWeek = this.getDayName(year, month, day);
      const isSelected = this.isSelected(day);

      return {
        day,
        dayOfWeek,
        duree: isSelected ? 1 : 0,
      };
    });
  }


  getDayName(year: number, month: number, day: number): string {
    const daysOfWeek = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
    const date = new Date(year, month, day);
    return daysOfWeek[date.getDay()];
  }
  videcra() {
    this.selectedDays = []
  }
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.mission_id = params['id'];
    });


    const user_id = localStorage.getItem('user_id')



    // Check if token is available
    if (token) {
      this.userservice.getpersonalinfobyid(user_id).subscribe({


        next: (res) => {
          // Handle the response from the server
          this.myinfo = res


          console.log("myinfo", this.myinfo);




        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.inscriptionservice.getMyPreRegister(this.headers).subscribe({
        next: (res) => {
          this.portage = res
          console.log(this.portage);


        }
      })
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
          console.log(this.mission_details);

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
    // this.markSelectedDays();
  }

  generateCalendar(year: number, month: number): void {
    this.daysInMonth = [];
    this.emptyStartDays = [];
    this.emptyEndDays = [];

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < firstDayOfMonth; i++) {
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
    this.initializeDaysInMonth(this.currentYear, this.currentMonth);
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
        Swal.fire('Success', "Mise à jour effectuée avec succès! veuillez noter que si vous validez le CRA, vous n'aurez plus accès à cette page à l'avenir", 'success');

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: " veuillez noter que si vous validez le CRA, vous n'aurez plus accès à cette page à l'avenir",
          showConfirmButton: false,
          timer: 3500
        });

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
}
