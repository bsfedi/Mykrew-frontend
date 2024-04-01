import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, of } from 'rxjs';

import { environment } from 'src/environments/environment';
const baseUrl = `${environment.baseUrl}`;

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  constructor(private http: HttpClient) { }

  createinscrption(data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.post(baseUrl + 'registration/create', data, options);
  }

  createinscrptiondoc(data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.post(baseUrl + 'registration/create4', data, options);
  }
  createinscrptionstep2(data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.post(baseUrl + 'registration/create2', data, options);
  }


  createinscrptionstep3(data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.post(baseUrl + 'registration/create3', data, options);
  }

  createinscrptionstep5(data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.post(baseUrl + 'registration/create5', data, options);
  }


  getPreinscriptionById(id_preinscription: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'registration/getPreinscriptionById/' + id_preinscription, options);
  }

  getPendingPreregisters(headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'registration/getPending', options);
  }

  getvalidatedPreregisters(headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'registration/getValidated', options);

  }
  getarichivedPreregisters(headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'registration/archived', options);

  }


  rhvalidation(id_preinscription: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'registration/rhValidation/' + id_preinscription, data, options);
  }
  getContaractByPrerigister(id_preinscription: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'contract/getContaractByPrerigister/' + id_preinscription, options);
  }


  validatePriseDeContact(id_preinscription: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'contract/validatePriseDeContact/' + id_preinscription, data, options);
  }
  validateClientValidation(id_preinscription: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'contract/validateClientValidation/' + id_preinscription, data, options);
  }
  validateJobCotractEdition(id_preinscription: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'contract/validateJobCotractEdition/' + id_preinscription, data, options);
  }
  validateContractValidation(id_preinscription: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'contract/validateContractValidation/' + id_preinscription, data, options);
  }
  getMyPreRegister(headers?: HttpHeaders) {
    // Include headers if provided

    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'registration/getMyPreRegister', options);
  }
  validatenewmission(id_mission: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'newMission/rhValidation/' + id_mission, data, options);
  }

  killmission(id_preregister: any, headers?: HttpHeaders): Observable<any> {
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'registration/killPreregister/' + id_preregister, options);

  }

  getPdf(datae: any) {
    return of(datae).pipe(delay(1000));
  }
}