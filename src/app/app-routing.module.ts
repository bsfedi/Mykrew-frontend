import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes as authRoutes } from './features/auth/auth.module'; // Make sure to provide the correct path to your auth module
import { routes as inscRoutes } from './features/inscription/inscription.module'
import { routes as rhRoutes } from './rh/rh.module'
import { routes as userRoutes } from './features/user/user.module'
const routes: Routes = [
  {
    path: '*',
    redirectTo: 'signin', // or you can specify a different component for unmatched routes
  },

  ...authRoutes,
  ...inscRoutes,
  ...rhRoutes,
  ...userRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
