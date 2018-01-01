import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PageService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private photoHeaders = new Headers({'Accept': 'application/json' });

  private reviewUrl = 'http://localhost:9000/review';  
  private chatUrl = 'http://localhost:9000/chat'
  private activitiesUrl = 'http://localhost:9000/activities'
  private dashboardUrl = 'http://localhost:9000/dashboard'
  private petDashboardUrl = 'http://localhost:9000/petDashboard'
  private photosUrl = 'http://localhost:9000/photos'
  private userProfileUrl = 'http://localhost:9000/userProfile'
  private personDashboardUrl = 'http://localhost:9000/PersonDashboard'
  private toDoListUrl = 'http://localhost:9000/todo'
  private mapUrl = 'http://localhost:9000/map'

  constructor(
    private http: Http,
    public authHttp: AuthHttp
  ) { }

  postReview(review: any): Promise<any> {
    return this.authHttp
      .post(this.reviewUrl, JSON.stringify(review), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  postChat(chat: any): Promise<any> {
    return this.authHttp
      .post(this.chatUrl, JSON.stringify(chat), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  postPhoto(photo: any, formData: FormData): Promise<any> {
    console.log(photo);
    return this.authHttp
      //.post(this.photosUrl, JSON.stringify(photo), { headers: this.headers })
      .post(this.photosUrl, formData, { headers: this.photoHeaders })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  getPhotos(email: any): Promise<any> {
    return this.authHttp
      .get(`${this.photosUrl}/${email}`, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  getUserProfile(email: any): Promise<any> {
    return this.authHttp
      .get(`${this.userProfileUrl}/${email}`, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  getPersonDashboard(email: any): Promise<any> {
    return this.authHttp
      .get(`${this.personDashboardUrl}/${email}`, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  postDashboard(dashboard: any): Promise<any> {
    return this.authHttp
      .post(this.dashboardUrl, JSON.stringify(dashboard), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  getDashboard(email: any): Promise<any> {
    return this.authHttp
      .get(`${this.dashboardUrl}/${email}`, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  postActivities(activities: any): Promise<any> {
    return this.authHttp
      .post(this.activitiesUrl, JSON.stringify(activities), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  getActivities(time: any): Promise<any> {
    return this.authHttp
      .get(`${this.activitiesUrl}/${time}`, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  postToDo(todo: any): Promise<any> {
    return this.authHttp
      .post(this.toDoListUrl, JSON.stringify(todo), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  getToDo(email: any): Promise<any> {
    return this.authHttp
      .get(`${this.toDoListUrl}/${email}`, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  getPet(id: any): Promise<any> {
    console.log('thisFired')
    console.log(id)
    return this.authHttp
      .get(`${this.petDashboardUrl}/${id}`, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
  postMap(location: any): Promise<any> {
    return this.http
      .post(this.mapUrl, JSON.stringify(location), { headers: this.headers })
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }
}


