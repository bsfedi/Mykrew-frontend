import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = `${environment.baseUrl}`;
import { saveAs } from 'file-saver';
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

  get_all_cra_by_userid(user_id: any) {
    return this.http.get(baseUrl + 'user/getAllcras/' + user_id)

  }

  sendemailconsultant(data: any) {
    return this.http.post(baseUrl + 'user/sendemailtoconsultant', data)

  }

  get_all_cra() {
    return this.http.get(baseUrl + 'user/craInformation/')
  }

  getMissionById(id_mission: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'newMission/getMissionById/' + id_mission, options);
  }
  downloadpdffile(pdfurl: any, filename: any) {
    console.log(pdfurl);

    // // Endpoint on your server for downloading files
    // const url = baseUrl + 'api/download?url=' + pdfurl;

    // // Determine file extension to set appropriate filename
    // const fileExtension = url.split('.').pop(); // Get the file extension

    // const fileName = 'downloaded_file.' + fileExtension; // Construct the filename

    // this.http.get(baseUrl, { responseType: 'blob' }).subscribe(blob => {
    //   // Save the downloaded blob to a file
    //   saveAs(blob, fileName);
    // });uploads/1710409543811-permis.jpg
    const url = baseUrl + 'api/download?url=' + pdfurl; // Endpoint on your server
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, filename + '.' + pdfurl.split('uploads')[1].split('.')[1]);
      // Handle the downloaded blob (e.g., save to local filesystem)
    });
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

    return this.http.get(baseUrl + 'user/getMissionById/' + user_id, options);
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
  getAllPendingMissions(headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.get(baseUrl + 'newMission/getAllPendingMissions', options);
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

  getRhNotificationsnotseen(): Observable<any> {
    // Include headers if provided

    return this.http.get(baseUrl + 'notification/getRhNotificationsnotseen');
  }

  createvirement(data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};

    return this.http.post(baseUrl + 'virement/createVirement', data, options);
  }
  getallvirements() {
    return this.http.get(baseUrl + 'virement/virements');
  }

  markNotificationAsSeen(notification_id: any) {
    return this.http.get(baseUrl + 'notification/markNotificationAsSeen/' + notification_id);
  }

  virementstatusbar(id_user: any) {
    return this.http.get(baseUrl + 'virement/virements/year-stats/2024/' + id_user);

  }
  getAllTjmRequest() {
    return this.http.get(baseUrl + 'tjmRequest/getAllTjmRequest');
  }
  getallTjmRequestsByMissionId(id: any) {
    return this.http.get(baseUrl + 'tjmRequest/getallTjmRequestsByMissionId/' + id);

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

  deleteconsultant(id: any) {

    // Include headers if provided
    return this.http.delete(baseUrl + 'user/delete/' + id);
  }

  updateAccountVisibility(id: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};
    // Include headers if provided
    return this.http.put(baseUrl + 'user/updateAccountVisibility/' + id, data, options);
  }
  updateconsultantstauts(id: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};
    // Include headers if provided
    return this.http.put(baseUrl + 'registration/updateconsultantstauts/' + id, data, options);
  }

  updateUserByAdmin(id: any, data: any, headers?: HttpHeaders): Observable<any> {
    // Include headers if provided
    const options = headers ? { headers } : {};
    // Include headers if provided
    return this.http.put(baseUrl + 'user/updateUserByAdmin/' + id, data, options);
  }


}

