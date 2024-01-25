import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreInscriptionComponent } from './pre-inscription/pre-inscription.component';
import { ClientComponent } from './client/client.component';
import { MissionComponent } from './mission/mission.component';
import { Routes } from '@angular/router';
import { PersonalDocComponent } from './personal-doc/personal-doc.component';

import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InformationsComponent } from './informations/informations.component';
import { LeftBarComponent } from '../../layout/left-bar/left-bar.component';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signin',
  },
  {
    path: 'pre-inscription',
    component: PreInscriptionComponent,
  },
  {
    path: 'personaldoc',
    component: PersonalDocComponent,
  },
  {
    path: 'client',
    component: ClientComponent
  },
  {
    path: 'mission',
    component: MissionComponent
  },
  {
    path: 'informations/:id',
    component: InformationsComponent
  },
];

@NgModule({
  declarations: [
    PreInscriptionComponent,
    ClientComponent,
    MissionComponent,
    PersonalDocComponent,
    InformationsComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    LeftBarComponent,

  ]
})
export class InscriptionModule { }
