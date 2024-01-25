import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PendingPreinscriptionComponent } from './pending-preinscription/pending-preinscription.component';
import { DashboardConsultantComponent } from './dashboard-consultant/dashboard-consultant.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { NewMissionComponent } from './new-mission/new-mission.component';
import { ProfilComponent } from './profil/profil.component';
import { MissionsComponent } from './missions/missions.component';
import { DetailsMissionComponent } from './details-mission/details-mission.component';
import { VirementsComponent } from './virements/virements.component';
import { InfoPersoComponent } from './info-perso/info-perso.component';
import { NotificationComponent } from 'src/app/layout/notification/notification.component';
import { LeftBarComponent } from 'src/app/layout/left-bar/left-bar.component';
import { CRAComponent } from './cra/cra.component';
import { AllnotificationsComponent } from './allnotifications/allnotifications.component';


export const routes: Routes = [
  {
    path: 'pending',
    component: PendingPreinscriptionComponent,
  },
  {
    path: 'consultant/dashboard',
    component: DashboardConsultantComponent,

  },
  {
    path: 'consultant/home',
    component: HomeUserComponent,

  },
  {
    path: 'consultant/new-mission',
    component: NewMissionComponent,

  },
  {
    path: 'consultant/profil',
    component: ProfilComponent,

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
    path: 'consultant/allnotifications',
    component: AllnotificationsComponent,

  },
  {
    path: 'CRA/:id', 
    component : CRAComponent
  }


];

@NgModule({
  declarations: [

    PendingPreinscriptionComponent,
    DashboardConsultantComponent,
    HomeUserComponent,
    NewMissionComponent,
    ProfilComponent,
    MissionsComponent,
    DetailsMissionComponent,
    VirementsComponent,
    InfoPersoComponent,
    NotificationComponent,
    CRAComponent,
    AllnotificationsComponent,
    

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
