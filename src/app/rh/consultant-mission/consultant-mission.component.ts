import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
const baseUrl = `${environment.baseUrl}`;
const clientName = `${environment.default}`;

@Component({
  selector: 'app-consultant-mission',
  templateUrl: './consultant-mission.component.html',
  styleUrls: ['./consultant-mission.component.css']
})
export class ConsultantMissionComponent {
  items: any;
  showfilter: boolean = false
  showPopup: boolean = false;
  showPopup1: boolean = false;
  isMenuOpen: boolean[] = [];
  headers: any
  clientValidation: any
  contactClient: any
  pageSize = 8; // Number of items per page
  currentPage = 1; // Current page
  currentPage14 = 1
  pageSize14 = 8
  currentPage15 = 1
  pageSize15 = 8
  totalPages: any;
  totalPages14: any
  totalPages15: any
  nbdemande: any
  contractValidation: any
  jobCotractEdition: any
  idcontractByPreregister: any
  getContaractByPrerigister: any
  user_id: any
  user_info: any
  fileInputs: any = {}; // Initialize fileInputs object
  document: string | null = null; // Initialize document property
  selectedFile: any
  myForm: FormGroup;
  docs: any
  virementTypes = ['Participation', 'Cooptation', 'Frais'];
  foremData: FormGroup;
  formData1: FormGroup;
  show_mission: boolean = true
  show_doc: boolean = false
  show_historique: boolean = false
  res: any
  res14: any
  filteredItems: any[] = [];
  showPopup3: any
  searchTerm: any
  searchTerm1: any
  constructor(private consultantservice: ConsultantService, private inscriptionservice: InscriptionService,
    private datePipe: DatePipe,
    private userservice: UserService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is zero-based, so add 1
    const day = today.getDate();
    // this.selectedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    this.foremData = this.fb.group({
      userId: [''],
      typeVirement: ['Participation', Validators.required],
      montant: ['', Validators.required],
      // Add other form controls as needed
    });
    this.formData1 = this.fb.group({
      email: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      // Add other form controls as needed
    });

    this.myForm = this.fb.group({

      documentName: ['', Validators.required],
      userDocument: ['', Validators.required],
      // Add other form controls as needed
    });
  }
  allcra: any

  gotomyprofile() {
    this.router.navigate([clientName + '/edit-profil'])
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
    const token = localStorage.getItem('token');
    this.route.params.subscribe((params) => {
      this.user_id = params['id'];
    });

    this.userservice.getMyvirements(this.user_id).subscribe({
      next: (res) => {
        // Sort the response array by createdAt in ascending order
        this.res14 = res.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1);


        this.res14 = this.res14.map((item: any) => ({
          ...item,
          createdAt: this.formatDate(item.createdAt),
        }));
      },
      error: (e) => {
        console.error(e);
        // Set loading to false in case of an error
      }
    });

    this.consultantservice.get_all_cra_by_userid(this.user_id).subscribe({


      next: (res) => {
        this.allcra = res
        this.allcra = this.allcra.craPdfs


        console.log("allcra", this.allcra);

        for (let item of this.allcra) {

          console.log("item", item);

          console.log("filename", item.filename);


          item.filename = baseUrl + "uploads/" + item.filename
          this.inscriptionservice.getPdf(item.filename).subscribe({

          });
        }
        // Handle the response from the server
        console.log("allc_cra_pdf", res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });



    this.userservice.getAllDacumentsofuser(this.user_id).subscribe({


      next: (res) => {
        // Handle the response from the server
        this.docs = res
        this.filteredItems = this.docs
        for (let item of this.filteredItems) {
          if (item.document.endsWith('.pdf')) {
            item.pdf = true
            item.document = baseUrl + "uploads/" + item.document
            this.inscriptionservice.getPdf(item.document).subscribe({

            });

          } else {
            item.pdf = false
            item.document = baseUrl + "uploads/" + item.document
          }

          //   if (item.document.split(['.'][-1] == 'pdf')){


        }




      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.userservice.getpersonalinfobyid(this.user_id).subscribe({
        next: (res) => {
          this.user_info = res

          this.user_info.carInfo.drivingLicense = baseUrl + "uploads/" + this.user_info.carInfo.drivingLicense;
          this.user_info.identificationDocument = baseUrl + "uploads/" + this.user_info.identificationDocument;
          this.user_info.ribDocument = baseUrl + "uploads/" + this.user_info.ribDocument;

          this.docs.push(
            {
              "createdAt": this.user_info.addedDate || '',
              "document": this.user_info.carInfo.drivingLicense,
              "documentName": "permis"
            },
            {
              "createdAt": this.user_info.addedDate || '',
              "document": this.user_info.identificationDocument,
              "documentName": "CNI"
            },
            {
              "createdAt": this.user_info.addedDate || '',
              "document": this.user_info.ribDocument,
              "documentName": "rib"
            }
          );
        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error
        }
      });

      this.consultantservice.getMissionsofUser(this.user_id, this.headers).subscribe({
        next: (res) => {
          // Handle the response from the server

          this.items = res


          for (let mission of this.items) {
            if (mission.validated_by) {
              console.log(this.getvalidateby(mission.validated_by));
              this.consultantservice.getuserinfomation(mission.validated_by).subscribe({
                next: (res) => {
                  mission.validated_by = res.firstName + ' ' + res.lastName
                },
                error: (e) => {
                  // Handle errors
                  console.error(e);
                  // Set loading to false in case of an error
                }
              });

            } else {
              mission.validated_by = ''
            }
            console.log(mission);


          }





        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }

  }
  getvalidateby(user_id: any) {
    return this.consultantservice.getuserinfomation(user_id);
  }
  onTypeChange() {

    this.showPopup1 = true;

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

  nextPage14() {
    if (this.currentPage14 < this.totalPages14) {
      this.currentPage14++;
    }
  }

  previousPage14() {
    if (this.currentPage14 > 1) {
      this.currentPage14--;
    }
  }
  nextPage15() {
    if (this.currentPage15 < this.totalPages15) {
      this.currentPage15++;
    }
  }

  previousPage15() {
    if (this.currentPage15 > 1) {
      this.currentPage15--;
    }
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  sendmail(email: any) {
    Swal.fire({
      title: 'Confirmez l\'envoi de l\'email',
      html: `
        <div>
          <div style="font-size:1.2rem;">Êtes-vous sûr de vouloir <br> envoyer cet email ?'</div> 
        </div>
      `,
      iconColor: '#1E1E1E',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      background: '#fefcf1',
      confirmButtonColor: "#91c593",
      cancelButtonText: 'Non',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {
        const formData1 = this.formData1.value;
        const data = {
          "email": email,
          "subject": formData1.subject,
          "message": formData1.message
        };
        this.consultantservice.sendemailconsultant(data).subscribe({
          next: (res) => {
            // Handle the response from the server
            Swal.fire({
              background: '#fefcf1',
              title: 'Email envoyé',
              text: 'L\'email a été envoyé avec succès !',
              confirmButtonColor: "#91c593",

            });
            this.showPopup3 = false;
          },
          error: (e) => {
            console.log(e);
            // Handle errors
            Swal.fire({
              background: '#fefcf1',
              title: 'Erreur d\'envoi',
              text: "L'envoi de l'email a échoué. Veuillez réessayer.",
              confirmButtonColor: "#91c593",
            });
          }
        });
      } else {
        Swal.fire({

          title: 'Envoi annulé',
          text: 'Aucun email n\'a été envoyé.',
          background: '#fefcf1',
          confirmButtonColor: "#91c593",
          confirmButtonText: 'Ok',

        });
      }
    });
  }
  click() {
    this.router.navigate([clientName + '/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate([clientName + '/mission/' + _id])
  }
  addvirement() {
    this.router.navigate([clientName + 'virements/' + this.user_id])
  }
  openPopup(): void {
    this.showPopup = true;
  }
  openPopup1(): void {
    this.showPopup1 = true;
  }
  gotomissions(_id: string) {
    this.router.navigate([clientName + '/missions/' + _id])
  }
  openPopup3(): void {
    this.showPopup3 = true;
  }
  selectedDate: any;
  applyFiltercra() {
    // Check if search term is empty
    if (this.searchTerm.trim() === ' ') {
      // If search term is empty, reset the filtered items to the original items
      this.docs = this.docs;
      console.log("docsssss" + this.docs);

    } else {
      // Apply filter based on search term
      this.docs = this.docs.filter((item: any) =>
        item.filename.split('uploads/')[1].toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      console.log("docseeeessss" + this.docs);
    }
  }
  getDisplayeddocs(): any[] {
    if (this.show_doc) {

      this.totalPages15 = Math.ceil(this.filteredItems.length / this.pageSize15);
      const startIndex = (this.currentPage15 - 1) * this.pageSize15;
      const endIndex = Math.min(startIndex + this.pageSize15, this.filteredItems.length);


      return this.filteredItems.slice(startIndex, endIndex);
    }
    else if (this.show_mission) {
      this.totalPages = Math.ceil(this.items.length / this.pageSize);
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.items.length);
      return this.items.slice(startIndex, endIndex);
    } else {
      this.totalPages = Math.ceil(this.allcra.length / this.pageSize);
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.allcra.length);
      return this.allcra.slice(startIndex, endIndex);
    }

  }
  filterByUploadDate(uploadDate: Date): boolean {
    if (!this.selectedDate) {
      this.showfilter = true
      return true; // No filter applied
    }
    else {
      this.showfilter = false
      // Format the uploadDate to match selectedDate format
      const formattedUploadMonth = this.datePipe.transform(uploadDate || '', 'yyyy-MM');
      const formattedSelectedMonth = this.datePipe.transform(this.selectedDate || '', 'yyyy-MM');

      // Check if the formatted months match
      return formattedUploadMonth === formattedSelectedMonth;
    }

  }
  applyFilter() {
    // Check if search term is empty


    if (this.searchTerm.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.filteredItems = this.docs;
    } else {


      // Apply filter based on search term
      this.filteredItems = this.docs.filter((item: any) =>
        item.documentName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      console.log(this.filteredItems);
    }
  }
  applyFilter1() {
    // Check if search term is empty


    if (this.searchTerm1.trim() === '') {
      // If search term is empty, reset the filtered items to the original items
      this.allcra = this.allcra.craPdfs
    } else {


      // Apply filter based on search term
      this.allcra = this.allcra.filter((item: any) =>
        item.client.toLowerCase().includes(this.searchTerm1.toLowerCase())
      );

    }
  }
  closePopup(): void {
    this.showPopup = false;

  }
  closePopup1(): void {
    this.showPopup1 = false;

  }
  closePopup3(): void {
    this.showPopup3 = false;

  }
  show_cra: boolean = false
  showdocs() {
    this.show_doc = true
    this.show_mission = false
    this.show_cra = false
    this.show_historique = false
  }

  showhistorique() {
    this.show_historique = true
    this.show_doc = false
    this.show_mission = false
    this.show_cra = false
  }

  showcras() {
    this.show_doc = false
    this.show_mission = false
    this.show_cra = true
    this.show_historique = false
  }

  showmidssions() {
    this.show_doc = false
    this.show_mission = true
    this.show_cra = false
    this.show_historique = false
  }
  gotocra(_id: string) {
    this.router.navigate([clientName + '/cra-mission/' + _id])
  }

  validatePriseDeContact(id: any, contactClient: any): void {
    console.log(id);

    const data = {
      "validated": contactClient
    }
    console.log(data);

    this.consultantservice.validatePriseDeContact(id, data, this.headers).subscribe({
      next: (res) => {
        console.log(res);

        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateClientValidation(id: any, clientValidation: any): void {
    const data = {
      "validated": clientValidation
    }
    this.consultantservice.validateClientValidation(id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
        console.log(res);

      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateJobCotractEdition(id: any, jobCotractEdition: any): void {
    const data = {
      "validated": jobCotractEdition
    }
    this.consultantservice.validateJobCotractEdition(id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  validateContractValidation(id: any, jobCotractEdition: any): void {
    const data = {
      "validated": jobCotractEdition
    }
    this.consultantservice.validateContractValidation(id, data, this.headers).subscribe({
      next: (res) => {
        // Handle the response from the server
      },
      error: (e) => {
        // Handle errors
        console.error(e);
        // Set loading to false in case of an error

      }
    });
  }
  gotovalidemission(mission_id: any, id: any) {
    this.router.navigate([clientName + '/validationmission/' + mission_id + '/' + id])
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
          const formData = new FormData();
          const document = this.fileInputs.document.files[0];

          console.log(document);

          // Append the files if they exist, else append empty strings
          formData.append('document', document);
          if (document.name.endsWith('.pdf')) {
            this.idpdf = true
          }
          console.log(formData);
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit(): void {
    const token = localStorage.getItem('token');

    if (token && this.selectedFile) {
      console.log(this.myForm.value.documentName);

      const formData = new FormData();
      formData.append('userDocument', this.selectedFile);
      formData.append('documentName', this.myForm.value.documentName);

      // Include the token in the headers
      const headers = new HttpHeaders().set('Authorization', `${token}`);

      this.consultantservice.addDocumentToUser(this.user_id, formData, headers)
        .subscribe({
          next: (res) => {

            Swal.fire({

              background: '#fefcf1',
              confirmButtonText: 'Ok',

              confirmButtonColor: "#91c593",
              title: 'Document ajouté avec succès!',
              showConfirmButton: false,
              timer: 3000 // Adjusted timer to 3000 milliseconds (3 seconds)
            });
            // Hide the popup after 3 seconds
            setTimeout(() => {
              this.showPopup = false;
              // Reload the page after hiding the popup
              window.location.reload();
            }, 1000);
            // Handle the response from the server
          },
          error: (e) => {
            // Handle errors
            console.error(e);
          }
        });
    }
  }

  downloadFile(urlpdf: any, filename: any) {

    this.consultantservice.downloadpdffile(urlpdf, filename)

  }

  onFormSubmit() {

    Swal.fire({
      title: 'Confirmer le virement',
      html: `
        <div>
          <div style="font-size:1.2rem;">Êtes-vous sûr de vouloir effectuer ce virement ?</div> 
        </div>
      `,
      iconColor: '#1E1E1E',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      background: '#fefcf1',
      confirmButtonColor: "#91c593",
      cancelButtonText: 'Non',
      cancelButtonColor: "black",
      customClass: {
        confirmButton: 'custom-confirm-button-class',
        cancelButton: 'custom-cancel-button-class'
      },
      reverseButtons: true // Reversing button order
    }).then((result) => {
      if (result.isConfirmed) {
        this.foremData.controls['userId'].setValue(this.user_id);

        this.consultantservice.createvirement(this.foremData.value).subscribe(
          (response) => {
            Swal.fire({
              background: '#fefcf1',
              title: 'Virement réussi',
              text: 'Le virement a été effectué avec succès !',
              confirmButtonColor: "#91c593",

            });
            this.showPopup1 = false
          },
          (error) => {
            Swal.fire({
              background: '#fefcf1',
              confirmButtonColor: "#91c593",
              title: 'Erreur de virement',
              text: "Le virement n'a pas pu être effectué. Veuillez réessayer.",

            });
          }
        );

      } else {
        Swal.fire({
          background: '#fefcf1',
          title: 'Virement annulé',
          text: 'Aucun virement n\'a été effectué.',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#91c593',
        });
      }
    });
  }

  // Dans votre composant TypeScript
  downloadDocument(documentUrl: string, documentName: string): void {
    console.log(documentName, documentUrl);

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

  getDisplayeddocs14(): any[] {


    this.totalPages14 = Math.ceil(this.res14.length / this.pageSize14);
    const startIndex = (this.currentPage14 - 1) * this.pageSize14;
    const endIndex = Math.min(startIndex + this.pageSize14, this.res14.length);


    return this.res14.slice(startIndex, endIndex);
  }
}
