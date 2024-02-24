import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = `${environment.baseUrl}`;



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  pingEndpoint() {
    // Replace 'http://localhost:3000' with your actual endpoint URL
    return this.http.get("https://mykrew-backend.onrender.com");
  }
  create(data: any): Observable<any> {
    return this.http.post(baseUrl + 'user/register', data);
  }

  login(data: any): Observable<any> {
    console.log(baseUrl);

    return this.http.post(baseUrl + 'user/login', data);
  }

  createinscrption(data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.post(baseUrl + 'registration/create', data, options);
  }
  editinscription(data: any, id: any, headers?: HttpHeaders) {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'registration/consultantEdit/' + id, data, options);
  }

  editIdentificationDocument(id: any, data: any): Observable<any> {
    // Include headers if provided


    return this.http.put(baseUrl + 'user/editIdentificationDocument/' + id, data);
  }


  editDrivingLiscence(id: any, data: any): Observable<any> {
    // Include headers if provided


    return this.http.put(baseUrl + 'user/editDrivingLiscence/' + id, data);
  }


  editribdocument(id: any, data: any): Observable<any> {
    // Include headers if provided


    return this.http.put(baseUrl + 'user/editRibDocument/' + id, data);
  }
  getMyvirements(id: any): Observable<any> {
    // Include headers if provided


    return this.http.get(baseUrl + 'virement/getMyvirements/' + id);
  }
  getpersonalinfobyid(id: any) {
    return this.http.get(baseUrl + 'user/getPersonnalInfoByUserId/' + id);
  }

  filter_by_type(type: any) {
    return this.http.get(baseUrl + 'virement/virements/' + type);
  }

  virementByPeriod(period: any, id: any) {
    return this.http.get(baseUrl + 'virement/virementByPeriod/participation/' + period + '/' + id);
  }

  getAllDacumentsofuser(id: any) {
    return this.http.get(baseUrl + 'user/getAllDacuments/' + id);
  }

  isAuthenticated() {
    // your implementation
  }

  hasRole(role: any) {
    if (role == localStorage.getItem('role')) {
      return true;
    }
    else {
      return false
    }

  }

}