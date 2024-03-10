import { Component } from '@angular/core';
import { ConsultantService } from 'src/app/services/consultant.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
const baseUrl = `${environment.baseUrl}`;
@Component({
  selector: 'app-all-cras',
  templateUrl: './all-cras.component.html',
  styleUrls: ['./all-cras.component.css']
})
export class AllCrasComponent {
  all_cras: any
  res: any
  constructor(private inscriptionservice: InscriptionService, private consultantservice: ConsultantService, private userservice: UserService, private socketService: WebSocketService) {
  }
  idCounter: number = 0;

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
}