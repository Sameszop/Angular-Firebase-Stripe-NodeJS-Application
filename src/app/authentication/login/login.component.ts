import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../firebase/firebase.service';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private firebase:FirebaseService, private router:Router, private shared:SharedService){}
  log_email:string = "";
  log_password:string = "";
  user:any;
  user_sub:Subscription|undefined;
  route_sub:Subscription|undefined
  async login_html(){
    if(this.log_email && this.log_password){  	
      await this.firebase.login(this.log_email, this.log_password).then(user => {
        this.shared.user$.next(user);
        user!=null ? this.router.navigate(["/goals"]): null;
        this.shared.initializeData();
      })
      
    }
    else {
      alert("Please fill all fields")
    }
  }
  to_register() {
    this.router.navigate(["register"]);
  }
  ngOnInit() {
    this.user_sub = this.shared.user$.subscribe(currentUser => {
      if(currentUser) {
        this.route_sub = this.shared.previousRoute$.subscribe(route => {
          if(route) {
            this.router.navigate([route]);
          }
        })
      }
    })

  }
  ngOnDestroy(): void {
    this.user_sub?.unsubscribe();
    this.route_sub?.unsubscribe();
  }
}
