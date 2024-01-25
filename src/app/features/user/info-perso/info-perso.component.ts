import { Component, ElementRef, ViewChild } from '@angular/core';
import { InscriptionService } from 'src/app/services/inscription.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

declare const PDFObject: any;

@Component({
  selector: 'app-info-perso',
  templateUrl: './info-perso.component.html',
  styleUrls: ['./info-perso.component.css']
})
export class InfoPersoComponent {
  res: any
  headers: any
  selectedFile: File | null = null;
  identificationDocument: any
  permis_img: any
  rib_img: any
  docs: any
  pdfData: any
  card: any
  @ViewChild('fileInput') fileInput: ElementRef | any;
  @ViewChild('fileInputdrivinglicence') fileInputdiving: ElementRef | any;
  @ViewChild('fileInputdib') fileInputdib: ElementRef | any;
  openFileInput() {
    // Trigger click event on the hidden file input
    this.fileInput.nativeElement.click();
  }
  openfileInputdrivinglicenceInput() {
    this.fileInputdiving.nativeElement.click();
  }
  openfileInputdibInput() {
    this.fileInputdib.nativeElement.click();
  }
  constructor(private inscriptionservice: InscriptionService, private userservice: UserService, private http: HttpClient) {

  }
  card_view() {
    this.card = true
  }

  list_view() {
    this.card = false
  }
  downloadImage() {

    const imageUrl = 'https://my-krew-8nnq.onrender.com/uploads/pdf.jpg';
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'downloaded_image.jpg'; // You can set the desired file name here
    link.click();
  }
  downloadItem() {
    const imageUrl = 'https://my-krew-8nnq.onrender.com/uploads/1705876895687-CIN.jpg';

    this.http.get(imageUrl, { responseType: 'blob' })
      .subscribe(
        (data: Blob) => {
          const blobUrl = window.URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'downloaded_image.jpg';
          link.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        (error: HttpErrorResponse) => {
          console.error('Download failed:', error);
          console.error('Status code:', error.status);
          console.error('Error message:', error.message);
        }
      );
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id')


    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.userservice.getpersonalinfobyid(user_id).subscribe({


        next: (res) => {
          // Handle the response from the server
          this.res = res
          console.log(this.res);
          this.res.carInfo.drivingLicense = "https://my-krew-8nnq.onrender.com/uploads/" + this.res.carInfo.drivingLicense

          this.res.identificationDocument = "https://my-krew-8nnq.onrender.com/uploads/" + this.res.identificationDocument


          this.res.ribDocument = "https://my-krew-8nnq.onrender.com/uploads/" + this.res.ribDocument




        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }



    this.userservice.getAllDacumentsofuser(user_id).subscribe({


      next: (res) => {
        // Handle the response from the server
        this.docs = res

        for (let item of this.docs) {

          if (item.document.endsWith('.pdf')) {
            item.pdf = true
            item.document = "https://my-krew-8nnq.onrender.com/uploads/" + item.document
            this.inscriptionservice.getPdf(item.document).subscribe({
              next: (res) => {
                this.pdfData = res;
                console.log(this.pdfData);


                if (this.pdfData) {
                  this.handleRenderPdf(this.pdfData);
                }
              },
            });

          } else {
            item.pdf = false
            item.document = "https://my-krew-8nnq.onrender.com/uploads/" + item.document
          }

          //   if (item.document.split(['.'][-1] == 'pdf')){


        }
        console.log(this.docs);



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
  editIdentificationDocument(id: any) {


  }
  // Assuming you have an object to hold file inputs
  fileInputs: any = {};

  setFileInput(field: string, event: any): void {
    const user_id = localStorage.getItem('user_id')
    this.fileInputs[field] = event.target;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Read the file and set the image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field == 'identificationDocument') {
          this.identificationDocument = e.target!.result as string;
          const formData = new FormData();
          const identificationDocument = this.fileInputs.identificationDocument.files[0];

          console.log(identificationDocument);

          // Append the files if they exist, else append empty strings
          formData.append('identificationDocument', identificationDocument);
          console.log(formData);

          this.userservice.editIdentificationDocument(user_id, formData).subscribe({

            next: (res) => {
              console.log(formData);

              console.log(res);

            }, error: (e) => {
              console.log(e);

            }
          });
        }
        else if (field == 'drivingLicense') {
          this.permis_img = e.target!.result as string;
          const formData = new FormData();
          const drivingLicense = this.fileInputs.drivingLicense.files[0];



          // Append the files if they exist, else append empty strings
          formData.append('drivingLicense', drivingLicense);
          console.log(formData);

          this.userservice.editDrivingLiscence(user_id, formData).subscribe({

            next: (res) => {
              console.log(formData);

              console.log("drivingLicense", res);

            }, error: (e) => {
              console.log(e);

            }
          });

        }
        else if (field == 'ribDocument') {
          this.rib_img = e.target!.result as string;
          const formData = new FormData();
          const ribDocument = this.fileInputs.ribDocument.files[0];



          // Append the files if they exist, else append empty strings
          formData.append('ribDocument', ribDocument);


          this.userservice.editribdocument(user_id, formData).subscribe({

            next: (res) => {
              console.log(formData);

              console.log("drivingLicense", res);

            }, error: (e) => {
              console.log(e);

            }
          });

        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Dans votre composant TypeScript
  downloadDocument(documentUrl: string, documentName: string): void {
    // Créez un élément <a> pour déclencher le téléchargement
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = documentName;

    // Ajoutez l'élément à la page et déclenchez le téléchargement
    document.body.appendChild(link);
    link.click();

    // Supprimez l'élément du DOM après le téléchargement
    document.body.removeChild(link);
  }
}
