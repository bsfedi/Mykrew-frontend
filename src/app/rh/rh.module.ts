import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { ValidationComponent } from './validation/validation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from '../auth/auth.module';
import { ConsultantMissionComponent } from './consultant-mission/consultant-mission.component';
import { MissionByIdComponent } from './mission-by-id/mission-by-id.component';
import { AllConsultantsComponent } from './all-consultants/all-consultants.component';
import { ValidationMissionComponent } from './validation-mission/validation-mission.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { LeftBarComponent } from '../layout/left-bar/left-bar.component';
import { NotificationComponent } from '../layout/notification/notification.component';
import { NotificaionRhComponent } from './notificaion-rh/notificaion-rh.component';
import { ChargeDocComponent } from './charge-doc/charge-doc.component';
import { VirementComponent } from './virement/virement.component';
import { TjmrequestsComponent } from './tjmrequests/tjmrequests.component';
import { ValidatedTjmComponent } from './validated-tjm/validated-tjm.component';
import { CraMissionComponent } from './cra-mission/cra-mission.component';
import { AdminComponent } from './admin/admin.component';
import { AllCrasComponent } from './all-cras/all-cras.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signin',
  },
  {
    path: 'allcras',
    component: AllCrasComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'allConsultants',
    component: AllConsultantsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'validation/:id',
    component: ValidationComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'missions/:id',
    component: ConsultantMissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mission/:id',
    component: MissionByIdComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'validationmission/:id_mission/:id',
    component: ValidationMissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'charge-document',
    component: ChargeDocComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'virements/:id',
    component: VirementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tjmrequests',
    component: TjmrequestsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'validated-tjmrequests/:id',
    component: ValidatedTjmComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cra-mission/:id',
    component: CraMissionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'members',
    component: AdminComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [
    DashboardComponent,
    ValidationComponent,
    ConsultantMissionComponent,
    MissionByIdComponent,
    AllConsultantsComponent,
    ValidationMissionComponent,
    NotificaionRhComponent,
    ChargeDocComponent,
    VirementComponent,
    TjmrequestsComponent,
    ValidatedTjmComponent,
    CraMissionComponent,
    AdminComponent,

    AllCrasComponent,
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,// Add FormsModule here
    LeftBarComponent,

  ],
})
export class RHModule { }
