import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { BehaviorSubject, retry, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {User} from "@angular/fire/auth";
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  init_subscription:Subscription|undefined;
  userData$ = new BehaviorSubject<any>(null);
  user$ = new BehaviorSubject<any>(null);
  uid$ = new BehaviorSubject<any>(null);
  count$ = new BehaviorSubject<any>(null);
  all_users$ = new BehaviorSubject<any>(null);
  token:any;
  currentWebsite:string|undefined;
  user:User|undefined;
  profilePic$ = new BehaviorSubject<any>(null);
  points$= new BehaviorSubject<number>(0);
  previousRoute$ = new BehaviorSubject<any>(null);
  constructor(private fb:FirebaseService, private http:HttpClient) { }
  async initializeData() {
    if(typeof window !== "undefined") {
      this.currentWebsite = `${window.location.protocol}//${window.location.host}`;
    }
      this.init_subscription = await this.fb.getUser().subscribe(async (current_user) => {
        if(current_user) {
          this.user$?.next(current_user);
          this.uid$?.next(current_user.uid);
          this.token = await current_user.getIdToken(); 
          const data = await this.fb.getUserData();
          data!=null ? this.userData$?.next(data): null;
          this.sendUser(current_user, data);
          this.points$.next(data.Points);
          if(current_user && data && current_user.uid) {
            this.init_subscription?.unsubscribe();
          }
        }else if(current_user === false) {
          this.user$.next(false)
        }
        await this.get_all_users().then(all_users => all_users ? this.all_users$.next(all_users):null).catch(err => console.log("Error for getting all users:",err));
        console.log(this.currentWebsite)
      },
    err =>  {
      console.log("Error in shared:"+ err)
    })
  }
  async sendPoints(points:number) {
    if(this.currentWebsite && this.token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.token}`
      });
      this.http.post<any>( this.currentWebsite+ "/api/points", {
        newPoints:points,
      }, {headers}).subscribe(response => {
        if(response) {
          if(response.status) {
            this.points$.next(points);
          }
          else {
            console.log(response.message);
          }
        }
      })
    }
  
  }
  async sendUser(user:User, data:any) {
    if(user && this.token){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.token}`
      });
      if(this.currentWebsite){
        this.http.post<any>(this.currentWebsite + "/api/user-information", {
          uid:user.uid,
          user_data:data,
        },{headers})
        .subscribe(response => {
          console.log(response.message);
          this.count$.next(response.count_obj);
        })
      }
    }
  }
  valid_email(email:string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);    
  }
  async send_count_update(change_status:boolean) {
    if(change_status && this.currentWebsite) { 
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.token}`
      });
      this.http.post<any>(this.currentWebsite + "/api/count",{},{headers})
      .subscribe(response => {
        if(response) {
          console.log(response)
          this.count$.next(response.new_count)
        }
      })
    }
  }
  async get_all_users() {
    return new Promise(async (resolve, reject) => {
      if(this.currentWebsite){
        await this.http.get(this.currentWebsite + "/api/getUsers", {responseType:"json"}).pipe(
          retry(3)).subscribe({
          next: (allUsers:any) => {
            if (allUsers) {
              resolve(allUsers);
            } else {
              reject('No users found');
            }
          },
          error: (err) => {
            console.error("Error: "+err.message)
            reject(err);
          }
        });
      }
    });
  }
  
}
