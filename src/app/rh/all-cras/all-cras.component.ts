import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
const baseUrl = `${environment.baseUrl}`;
@Component({
  selector: 'app-all-cras',
  templateUrl: './all-cras.component.html',
  styleUrls: ['./all-cras.component.css']
})
export class AllCrasComponent {
  all_cras: any
  res: any
  selectedDate: any;
  constructor(private inscriptionservice: InscriptionService, private datePipe: DatePipe, private consultantservice: ConsultantService, private userservice: UserService, private socketService: WebSocketService) {
    // Set the initial value of selectedDate to today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is zero-based, so add 1
    const day = today.getDate();
    this.selectedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  idCounter: number = 0;
  // Variable to store selected date



  // Method to filter by upload date
  filterByUploadDate(uploadDate: Date): boolean {
    if (!this.selectedDate) {
      return true; // No filter applied
    }

    // Format the uploadDate to match selectedDate format
    const formattedUploadMonth = this.datePipe.transform(uploadDate, 'yyyy-MM');
    const formattedSelectedMonth = this.datePipe.transform(this.selectedDate, 'yyyy-MM');

    // Check if the formatted months match
    return formattedUploadMonth === formattedSelectedMonth;
  }

  getId(i: number, j: number, all_cras: any[]): number {
    let id = 0;
    for (let index = 0; index < i; index++) {
      id += all_cras[index].craInformation.craPDF.length;
    }
    return id + j + 1;
  }
  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');




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
    this.consultantservice.get_all_cra().subscribe({
      next: (res) => {
        this.all_cras = res
        for (let item of this.all_cras) {
          console.log(item.craInformation.craPDF);

          for (let crapdf of item.craInformation.craPDF) {
            crapdf.filename = baseUrl + "uploads/" + crapdf.filename
            this.inscriptionservice.getPdf(crapdf.filename).subscribe({

            });
          }
          // console.log("item", item);

          // console.log("filename", item.filename);



        }
      }, error(e) {
        console.log(e);

      }
    }); {

    }
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  downloadDocument(documentUrl: string, documentName: string): void {
    console.log(documentName, documentUrl);

    // Create an <a> element to trigger the download
    const link = document.createElement('a');
    link.href = documentUrl;
    link.target = '_blank'; // Open in a new tab/window
    link.download = documentName + '.pdf'; // Ensure the file is downloaded with .pdf extension

    // Add the element to the page and trigger the download
    document.body.appendChild(link);
    link.click();

    // Remove the element from the DOM after download
    document.body.removeChild(link);
  }

}
