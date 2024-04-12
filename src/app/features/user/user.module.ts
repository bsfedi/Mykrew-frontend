import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PendingPreinscriptionComponent } from './pending-preinscription/pending-preinscription.component';


import { NgApexchartsModule } from "ng-apexcharts";
import { NewMissionComponent } from './new-mission/new-mission.component';

import { MissionsComponent } from './missions/missions.component';
import { DetailsMissionComponent } from './details-mission/details-mission.component';
import { VirementsComponent } from './virements/virements.component';
import { InfoPersoComponent } from './info-perso/info-perso.component';
import { NotificationComponent } from 'src/app/layout/notification/notification.component';
import { LeftBarComponent } from 'src/app/layout/left-bar/left-bar.component';
import { CRAComponent } from './cra/cra.component';
import { AllnotificationsComponent } from './allnotifications/allnotifications.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { EditProfilComponent } from 'src/app/features/user/edit-profil/edit-profil.component';


export const routes: Routes = [
  {
    path: 'pending',
    component: PendingPreinscriptionComponent,
  },

  {
    path: 'consultant/new-mission',
    component: NewMissionComponent,

  },


  {
    path: 'consultant/missions',
    component: MissionsComponent,

  },
  {
    path: 'consultant/details-mission/:id',
    component: DetailsMissionComponent,

  },
  {
    path: 'consultant/virements',
    component: VirementsComponent,

  },
  {
    path: 'consultant/infoperso',
    component: InfoPersoComponent,

  },
  {
    path: "mot-de-passe-oublier",
    component: ForgetPasswordComponent
  },
  {
    path: "change-mot-de-passe/:user_id",
    component: UpdatePasswordComponent
  },
  {
    path: 'consultant/allnotifications',
    component: AllnotificationsComponent,

  },
  {
    path: 'CRA/:id',
    component: CRAComponent
  },
  {
    path: 'edit-profil',
    component: EditProfilComponent
  }


];

@NgModule({
  declarations: [

    PendingPreinscriptionComponent,
    NewMissionComponent,
    MissionsComponent,
    DetailsMissionComponent,
    VirementsComponent,
    InfoPersoComponent,
    NotificationComponent,
    CRAComponent,
    AllnotificationsComponent,
    ForgetPasswordComponent,
    EditProfilComponent,
    UpdatePasswordComponent,


  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    LeftBarComponent,


  ]
})
export class AuthModule { }
