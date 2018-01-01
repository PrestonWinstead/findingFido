import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';
import { PageService } from '../services/page.service';
const moment = require('moment');


@Component({
  templateUrl: 'dashboard.component.html',
  //styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pet: boolean;
  personNeeded: boolean;
  time: Date;
  date: Date;
  location: string;
  photos: any;
  activities: any;
  profile: any;
  requests: any;
  user: any;
  filesToUpload: Array<File>;


  constructor(
    private router: Router,
    public authService: AuthService,
    private pageService: PageService
  ) { }

  ngOnInit() {
    if (this.authService.userProfile) {
      this.profile = this.authService.userProfile;
    } else {
      this.authService.getProfile((err, profile) => {
        this.profile = profile;
        this.pageService.getPersonDashboard(profile.email)
          .then(information => {
            this.requests = information.activities;
            this.activities = information.todolist;
            this.user = information.userInfo;
            console.log(information);
          })
      });
    }
    this.filesToUpload = [];
  }

  onPictures(): void {
    this.pageService.getPhotos(this.profile.email)
      .then(info => {
        this.photos = info.photos;
        console.log(info)
      })
  }  

  onSelectFriend(): void {
    this.router.navigate(['/schedule']);
  }
  onSelectPet(): void {
    this.pet = true;
  }
  cleanDate(date): void {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
  }
  onSelect(): void {
    this.personNeeded = true;
    const activities = {
      time: this.time,
      date: this.date,
      location: this.location,
      profile: this.profile,
    }
    this.pageService.postActivities(activities)
      .then(activities => console.log(activities))
  }
  upload() {
    this.makeFileRequest("http://localhost:9000/photos", [this.profile.name], this.filesToUpload).then((result) => {
      console.log(result);
    }, (error) => {
      console.log(error);
    });
  }
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }
      if (params && params[0]) {
        url += params;
      }
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }
}