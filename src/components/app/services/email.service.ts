/*@Injectable()
class MyService() {}
Declares that a class has dependencies that should be injected into the constructor 
when the dependency injector is creating an instance of this class.*/

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

// Note the Angular http.get returns an RxJS Observable.
// Observables are a powerful way to manage asynchronous data flows.
// We are converting the Observable to a Promise using the toPromise operator thru rxjs.
import 'rxjs/add/operator/toPromise';

@Injectable()
export class EmailService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private profileUrl = 'http://localhost:9000/profile';  
  private personUrl = 'http://localhost:9000/personSignup';
  private petUrl = 'http://localhost:9000/petSignup';

  constructor(
    private http: Http,
    public authHttp: AuthHttp
  ) { }


  postPersonSignUp(user: any): Promise<any> {
    return this.authHttp
      .post(this.personUrl, JSON.stringify(user), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  postPetSignUp(pet: any): Promise<any> {
    return this.authHttp
      .post(this.petUrl, JSON.stringify(pet), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  putProfile(profile: any): Promise<any> {
    return this.authHttp
      .put(this.profileUrl, JSON.stringify(profile), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  deleteProfile(profile: any): Promise<any> {
    return this.authHttp
      .delete(this.profileUrl, JSON.stringify(profile))
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }
}



