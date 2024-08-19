import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild,  } from '@angular/core';
import { last, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from './shared/shared.service';
import { authGuard } from './guards/auth.guard';
import { FirebaseService } from './firebase/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  constructor(private shared_data:SharedService, private router:Router, private fb:FirebaseService){}
  title = 'Payment';
  user_data:any;
  user:any=false;
  user_subscription:Subscription|undefined;
  left_days:number = 1;
  membership_subscription:Subscription|undefined;
  membership_status= true;
  async got_user(new_user:any){
    this.user = new_user;
    this.shared_data.initializeData();
  }
  async ngOnInit() {
    this.shared_data.initializeData();
    this.user_subscription = this.shared_data.user$?.subscribe(current_user => {
      if(current_user) {
        this.user = current_user;
        this.shared_data.previousRoute$.subscribe(route => {
          if(route == null) {
            this.router.navigate(["/goals"])
          }
        })
      }
    });
    this.membership_subscription = this.shared_data.userData$?.subscribe(async data => {
      if (data && data.payment && data.payment.payment_status) {
        this.membership_status = data.payment.payment_status;
      }
      else if(data && data.left_days == 0 && data.payment == null) {
        alert("Your free trial is over. Now you need a Subscription");
        // this.router.navigate(["/membership"])
      } 
      else {
        // Optionally, handle the case where payment is null or undefined
        console.log("No payment data available");
      }
      if(data && typeof data.profile_pic === "number") {
        if(data.profile_pic == 0)  data.profile_pic = "assets/img/profilePic1.jpeg"; await this.fb.store_all_data({profile_pic:"assets/img/profilePic1.jpeg"})
        if(data.profile_pic == 1) data.profile_pic = "assets/img/profilePic2.jpeg"; await this.fb.store_all_data({profile_pic:"assets/img/profilePic2.jpeg"})
      }
    });  
  }
  ngOnDestroy(): void {
    this.user_subscription?.unsubscribe();
    this.membership_subscription?.unsubscribe();
    this.shared_data.previousRoute$?.unsubscribe();
  }
}