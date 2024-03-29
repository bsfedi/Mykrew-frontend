// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes as authRoutes } from './features/auth/auth.module';
import { routes as inscRoutes } from './features/inscription/inscription.module';
import { routes as rhRoutes } from './rh/rh.module';
import { routes as userRoutes } from './features/user/user.module';
import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';
const clientName = `${environment.default}`;

const clientRoutes: Routes = [
  ...authRoutes,
  ...inscRoutes,
  ...rhRoutes,
  ...userRoutes
];


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `${clientName}/sign-in`,  // Redirect to the sign-in route
  },
  {
    path: `${clientName}`, // Dynamic path parameter for the 'client'
    children: [
      ...clientRoutes,
      // Add more child routes specific to the dynamic 'client' path if needed
    ],
  },
  {
    path: '*', // Note: It's better to use '**' for wildcard routes
    redirectTo: `${clientName}/sing-in`, // Redirect to your default route under the dynamic 'client'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
