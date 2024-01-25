import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, of } from 'rxjs';

const baseUrl = 'https://my-krew-8nnq.onrender.com/';

@Injectable({
  providedIn: 'root'
})


export class ConsultantService {

  constructor(private http: HttpClient) { }

  createNewMission(data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.post(baseUrl + 'newMission/createNewMission', data, options);
  }

  getMyMissions(headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'user/getMyMissions', options);
  }



  getMissionById(id_mission: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'newMission/getMissionById/' + id_mission, options);
  }

  getUserMissionById(id_mission: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'user/getMissionById/' + id_mission, options);
  }

  getMissionsofUser(user_id: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'user/getMissions/' + user_id, options);
  }

  editmission(data: any, id: any, headers?: HttpHeaders) {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'newMission/consultantEdit/' + id, data, options);
  }
  getMissionuserbyid(user_id: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'newMission/getMissionById/' + user_id, options);
  }

  validatePriseDeContact(id_mission: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'contract/validatePriseDeContact/' + id_mission, data, options);
  }
  validateClientValidation(id_mission: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'contract/validateClientValidation/' + id_mission, data, options);
  }
  validateJobCotractEdition(id_mission: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'contract/validateJobCotractEdition/' + id_mission, data, options);
  }
  validateContractValidation(id_mission: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'contract/validateContractValidation/' + id_mission, data, options);
  }

  getPendingMissions(headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'newMission/getPendingMissions', options);
  }
  getpreregisterbyuid(id: any, headers?: HttpHeaders) {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'user/getPreregisterByUserId/' + id, options);

  }
  getValidatedMissions(headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'newMission/getValidatedMissions', options);
  }
  getNotValidatedMissions(headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'newMission/notValidatedNewMission', options);
  }



  getContaractById(id_mission: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'contract/getContaractById/' + id_mission);
  }
  getuserinfomation(id: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'user/getPersonnalInfoByUserId/' + id);
  }

  killnewMission(id_mission: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'newMission/killMission/' + id_mission, data, options);
  }

  getlastnotifications(id: any): Observable<any> {
    // Include headers if provided

    return this.http.get(baseUrl + 'notification/getlastnotification/' + id);
  }

  getlastnotificationsrh(): Observable<any> {
    // Include headers if provided

    return this.http.get(baseUrl + 'notification/getRhNotification');
  }

  createvirement(data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.post(baseUrl + 'virement/createVirement', data, options);
  }
  getallvirements() {
    return this.http.get(baseUrl + 'virement/virements');
  }

  virementstatusbar(id_user: any) {
    return this.http.get(baseUrl + 'virement/virements/year-stats/2024/' + id_user);

  }
  getAllTjmRequest() {
    return this.http.get(baseUrl + 'tjmRequest/getAllTjmRequest');
  }

  addDocumentToUser(id: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.put(baseUrl + 'user/addDocumentToUser/' + id, data, options);
  }
  createTjmRequest(data: any): Observable<any> {
    // Include headers if provided
    return this.http.post(baseUrl + 'tjmRequest/createTjmRequest', data);
  }

  rhTjmValidation(id: any, data: any): Observable<any> {
    // Include headers if provided
    return this.http.put(baseUrl + 'tjmRequest/rhTjmValidation/' + id, data);
  }

  getTjmRequestsByMissionId(id: any) {
    return this.http.get(baseUrl + 'tjmRequest/getTjmRequestsByMissionId/' + id);
  }
  getMonthlyStatsForAllUsers() {
    return this.http.get(baseUrl + 'user/getMonthlyStatsForAllUsers');
  }

  getallnotification(id: any) {
    return this.http.get(baseUrl + 'notification/getAllMyNotifications/' + id);

  }

  getlastvirementnotification(id: any) {
    return this.http.get(baseUrl + 'notification/getMy5LastvirementsNotification/' + id);
  }


  updateCra(id: any, data: any): Observable<any> {
    // Include headers if provided
    return this.http.put(baseUrl + 'user/updateCra/' + id, data);
  }

  getcrabymissionid(id: any) {
    return this.http.get(baseUrl + 'user/getCraInformations/' + id);
  }
  getallrh() {
    return this.http.get(baseUrl + 'user/getrhUsers');
  }

  addrhuser(data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};
    // Include headers if provided
    return this.http.post(baseUrl + 'user/createByAdmin', data, options);
  }
  getTjmStats() {
    return this.http.get(baseUrl + 'tjmRequest/getTjmStats');
  }

  getConsultantStats() {
    return this.http.get(baseUrl + 'user/getConsultantStats');
  }
  addCraPdfToUser(id: any, data: any) {

    // Include headers if provided
    return this.http.put(baseUrl + 'user/addCraPdfToUser/' + id, data);
  }

  getConsultantusers() {
    return this.http.get(baseUrl + 'user/getConsultantusers');
  }

  updateAccountVisibility(id: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};
    // Include headers if provided
    return this.http.put(baseUrl + 'user/updateAccountVisibility/' + id, data, options);
  }

  updateUserByAdmin(id: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};
    // Include headers if provided
    return this.http.put(baseUrl + 'user/updateUserByAdmin/' + id, data, options);
  }


}

