import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-consultant-mission',
  templateUrl: './consultant-mission.component.html',
  styleUrls: ['./consultant-mission.component.css']
})
export class ConsultantMissionComponent {
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
  user_id: any
  user_info :any
  fileInputs: any = {}; // Initialize fileInputs object
  document: string | null = null; // Initialize document property
  selectedFile :any
  myForm: FormGroup;
  docs:any
  virementTypes = ['Participation', 'Cooptation', 'Frais'];
  foremData :FormGroup ;
  show_mission : boolean = true
  show_doc : boolean =false
  constructor(private consultantservice: ConsultantService, private inscriptionservice: InscriptionService, private userservice :UserService,private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {

    this.foremData = this.fb.group({
      userId: [''],
      typeVirement: ['Participation', Validators.required],
      montant: ['', Validators.required],
      // Add other form controls as needed
    });
  
    this.myForm = this.fb.group({
      
      documentName: ['', Validators.required],
      userDocument: ['', Validators.required],
      // Add other form controls as needed
    });
  }
  ngOnInit(): void {


    const token = localStorage.getItem('token');
    this.route.params.subscribe((params) => {
      this.user_id = params['id'];
    });

   this.userservice.getAllDacumentsofuser(this.user_id).subscribe({


      next: (res) => {
        // Handle the response from the server
        this.docs = res

        for(let item of this.docs){
          if (item.document.endsWith('.pdf')) {
            item.pdf =true
            item.document =  "https://my-krew-8nnq.onrender.com/uploads/" + item.document
            this.inscriptionservice.getPdf(item.document).subscribe({

            });

          }else{
            item.pdf =false
            item.document =  "https://my-krew-8nnq.onrender.com/uploads/" + item.document
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
    // Check if token is available
    if (token) {
      // Include the token in the headers
      this.headers = new HttpHeaders().set('Authorization', `${token}`);
      this.consultantservice.getpreregisterbyuid(this.user_id).subscribe({
        next: (res) => {
          this.user_info =res     
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

          console.log(res);
          this.items = res
          this.nbdemande = this.items.length()
          console.log(this.nbdemande);





        },
        error: (e) => {
          // Handle errors
          console.error(e);
          // Set loading to false in case of an error

        }
      });
    }
  
  }
 
  click() {
    this.router.navigate(['/all-preinscription']);
  }
  toggleMenu(i: number) {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }
  gotovalidation(_id: string) {
    this.router.navigate(['/mission/' + _id])
  }
  addvirement(){
    this.router.navigate(['virements/'+this.user_id])
  }
  openPopup(): void {
    this.showPopup = true;
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
  showdocs(){
    this.show_doc =true
    this.show_mission =false
  }
  gotocra(_id: string) {
    this.router.navigate(['/cra-mission/' + _id])
  }
  showmidssions(){
    this.show_doc =false
    this.show_mission =true
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
  gotovalidemission(mission_id:any,id: any) {
    this.router.navigate(['/validationmission/'+mission_id +'/' + id])
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
        const formData = new FormData();
        const document = this.fileInputs.document.files[0];
        
        console.log(document);
        
        // Append the files if they exist, else append empty strings
        formData.append('document', document);
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

    this.consultantservice.addDocumentToUser(this.user_id,formData, headers)
      .subscribe({
        next: (res) => {
          Swal.fire('Success', "Document ajouté avec succès!", 'success');
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: 'Document ajouté avec succès!',
              showConfirmButton: false,
              timer: 1500
            });
            this.showPopup=false
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
onFormSubmit() {
  Swal.fire({
    title: 'Confirmer le virement',
    text: 'Êtes-vous sûr de vouloir effectuer ce virement ?',
    icon: 'question',
    iconColor: '#1E1E1E',
    showCancelButton: true,
    confirmButtonText: 'Oui, effectuer le virement !',
    confirmButtonColor: '#1E1E1E',
    cancelButtonText: 'Annuler',
    customClass: {
      confirmButton: 'custom-confirm-button-class'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.foremData.controls['userId'].setValue(this.user_id);

      this.consultantservice.createvirement(this.foremData.value).subscribe(
        (response) => {
          Swal.fire({
            title: 'Virement réussi',
            text: 'Le virement a été effectué avec succès !',
            icon: 'success'
          });
          this.showPopup1=false
        },
        (error) => {
          Swal.fire({
            title: 'Erreur de virement',
            text: "Le virement n'a pas pu être effectué. Veuillez réessayer.",
            icon: 'error'
          });
        }
      );

    } else {
      Swal.fire({
        title: 'Virement annulé',
        text: 'Aucun virement n\'a été effectué.',
        icon: 'info',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1E1E1E',
      });
    }
  });
}

}
