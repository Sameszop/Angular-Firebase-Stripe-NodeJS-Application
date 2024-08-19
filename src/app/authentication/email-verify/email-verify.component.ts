import { Component, OnDestroy, OnInit } from '@angular/core';
import { sendEmailVerification, User } from '@angular/fire/auth';
import { FirebaseService } from '../../firebase/firebase.service';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrl: './email-verify.component.css'
})
export class EmailVerifyComponent implements OnInit, OnDestroy{
  constructor(private fb:FirebaseService, private shared:SharedService, private router:Router) {}
  user:User|undefined|null;
  userSub:Subscription|undefined;
  async sendEmail() {
    if(this.user){
      await sendEmailVerification(this.user);
    }
  }
 async verified() {
  var newUser = await this.fb.Authentication.currentUser;
  if(newUser?.emailVerified) {
    this.router.navigate(["/goals"]);
    this.shared.user$.next(newUser);
  }
 }
  ngOnInit(): void {
    this.userSub = this.shared.user$.subscribe(async currentUser => {
      if(currentUser) {
        this.user = currentUser;
        await this.sendEmail();
        if(currentUser.emailVerified) {
          this.router.navigate(["/goals"]);
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}