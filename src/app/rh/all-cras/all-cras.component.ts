import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
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

  filterditems: any;
  new_notif: any
  nblastnotifications: any
  lastnotifications: any
  searchTerm: any
  notification: string[] = [];
  shownotiff: boolean = false
  constructor(private inscriptionservice: InscriptionService, private router: Router, private datePipe: DatePipe, private http: HttpClient, private consultantservice: ConsultantService, private userservice: UserService, private socketService: WebSocketService) {
    // Set the initial value of selectedDate to today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is zero-based, so add 1
    const day = today.getDate();
    this.selectedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  idCounter: number = 0;
  // Variable to store selected date

  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
  }
  applyFilter() {
    // Check if search term is empty

    // Check if search term is empty
    if (this.searchTerm.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filterditems = this.all_cras;
    } else {
      // Apply filter based on search term
      console.log(this.all_cras);
      this.filterditems = this.all_cras.filter((item: any) =>


        item.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  downloadFile(urlpdf: any, filename: any) {

    this.consultantservice.downloadpdffile(urlpdf, filename)

  }
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
  shownotif() {

    this.shownotiff = !this.shownotiff
  }

  pageSize = 20; // Number of items per page
  currentPage = 1; // Current page
  totalPages: any;

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
    // Check if token is available
    if (token) {
      this.consultantservice.getRhNotificationsnotseen().subscribe({
        next: (res1) => {
          this.nblastnotifications = res1.length
          this.lastnotifications = res1

        },
        error: (e) => {
          // Handle errors
          this.nblastnotifications = 0
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }

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

        this.filterditems = this.all_cras
        for (let item of this.all_cras) {
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

  getDisplayeddocs(): any[] {


    this.totalPages = Math.ceil(this.filterditems.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filterditems.length);


    return this.filterditems.slice(startIndex, endIndex);



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
