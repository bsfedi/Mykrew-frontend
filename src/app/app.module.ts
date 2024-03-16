import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from "ng-apexcharts";
import { CommonModule, DatePipe } from '@angular/common';
import { LeftBarComponent } from './layout/left-bar/left-bar.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { WebSocketService } from './services/web-socket.service';

import { environment } from 'src/environments/environment';
import { ProfilComponent } from './layout/profil/profil.component';
import { EditProfilComponent } from './features/user/edit-profil/edit-profil.component';
const baseUrl = `${environment.baseUrl}`;

const config: SocketIoConfig = { url: baseUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ProfilComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgApexchartsModule,
    SocketIoModule.forRoot(config) // Add SocketIoModule with the configuration



  ],
  providers: [WebSocketService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
