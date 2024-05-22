import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
const baseUrl = "http://152.228.135.170:5200/"
@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.css']
})
export class EntrepriseComponent {
  entreprisefrom: FormGroup;
  show_second = false
  show = true
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.entreprisefrom = this.fb.group({
      name: ['', [Validators.required]],
      siret: ['', [Validators.required]],
      secteur: ['', [Validators.required]],
      taille: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      site_web: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      fonction: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],


    });
  }
  sendemailconsultant(data: any) {

    return this.http.post(baseUrl + 'add_entreprise', data)

  }
  Suivante() {
    this.show_second = true

  }
  show_url = false
  paiment(): void {
    if (this.entreprisefrom.pristine) {
      this.entreprisefrom.markAllAsTouched();
      return;
    }

    this.show = false


    this.sendemailconsultant(this.entreprisefrom.value)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.show_url = true

          if (res.message == "Entreprise added successfully!") {

            this.show = true
            console.log();

          }


        },
        error: (e) => {

        }
      });


  }
}
