import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class APIService {
    private webApiUrl: string;
  constructor(private _http: Http) { 
      this.webApiUrl = 'http://localhost:7777/api/';
  }

// Send SMS
  sendSMS(sms: any): Observable<any> {
    let body = JSON.stringify(sms);
    let headers = new Headers({ 'Accept': 'application/json','Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(this.webApiUrl+'sms/userapprovedsms', body, options)
        .map((response: Response) => <any>response)
        .catch(this.handleError);
  }

  sendEmail(order: any): Observable<any> {
    let body = JSON.stringify(order);
    let headers = new Headers({ 'Accept': 'application/json','Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(this.webApiUrl+'sendMail', body, options)
        .map((response: Response) => <any>response)
        .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throw(error.json().error || 'Server error');
  }

}