import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class StripePayService {
  constructor(private http:HttpClient, private fb:FirebaseService, private shared:SharedService){}
  async startCheckout() {
    if(this.shared.currentWebsite){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.shared.token}`
      });
      this.http.post<any>(this.shared.currentWebsite + "/api/checkout", {
        url:this.shared.currentWebsite,
      }, {headers})
      .subscribe(response => {
        window.location.href = response.url;
      });
    }
  }
  async endSubscription() {
    var user_info = await this.fb.getUserData("payment");
    if(user_info.payment_status && user_info.subscription_id && this.shared.currentWebsite) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.shared.token}`
      });
      this.http.post<any>(this.shared.currentWebsite + "/api/cancel","",{headers})
      .subscribe(response => {
        if(response === "success") {
          alert("Everything worked, you are now not a user anymore");
        }
        else {
          alert ("there was an error, please send an email to customer support")
        }
      })  
    }
    else{
      throw alert("You do not posses any membership, if there is a problem please send us an email and we will help you (at the footer)")
    }
  }
}