import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from '../../firebase/firebase.service';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private firebase:FirebaseService, private router:Router, private shared:SharedService, private http:HttpClient){}
  hasNumber = /\d/;
  hasLetters = /[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*[a-zA-Z]/;
  reg_name:string|undefined;
  reg_email:string|undefined;
  reg_password:string|undefined;
  reg_password2:string|undefined;
  async register_html(){
    var valid=this.isValidPassword();
    if (valid && this.reg_password && this.reg_email && this.reg_name ) {
      this.http.post<any>("/api/register", {name:this.reg_name}).subscribe(async answer => {
        if(answer && this.reg_password && this.reg_email && this.reg_name) {
          await this.firebase.register(this.reg_name, this.reg_email, this.reg_password).then(async user=> {
            if(user) {
              this.shared.user$.next(user);
              this.router.navigate(["/goals"]);
              // this.shared.initializeData();
            }
          })
        }
        else {
          alert("Username not valid or already in use");
        }
      })
    }
  }
  to_login() {
    this.router.navigate(["/login"]);
  }
  isValidPassword() {
    if (this.reg_password &&this.reg_name && this.reg_password.length >= 7 && this.reg_password.length < 100 && this.hasLetters.test(this.reg_password) && this.hasNumber.test(this.reg_password)&& this.reg_password === this.reg_password2) {
      return true;
    } else {
      if(!this.reg_password || !this.reg_password2) {
        alert("All password fields need to be filled");
      }else if(this.reg_password !== this.reg_password2){
        alert("passwords are varying");
      }else if(this.reg_password.length < 7) {
        alert("password is to short")
      }else if (this.reg_password.length > 99) {
        alert("password is to long");
      }else if(!this.hasNumber.test(this.reg_password)){
        alert("no number inside the password");
      }else if(!this.reg_name) {
        alert("name field must be fulfilled");
      }else if (!this.reg_email) {
        alert("set an email")
      }else if(!this.hasLetters.test(this.reg_password)) {
        alert("at least 5 letters");
      }
      return false;
    }
       
  }
  openInNewTab(route:string) {
    const url = this.router.serializeUrl(this.router.createUrlTree([route]));
    window.open(url, '_blank');
  }
}
