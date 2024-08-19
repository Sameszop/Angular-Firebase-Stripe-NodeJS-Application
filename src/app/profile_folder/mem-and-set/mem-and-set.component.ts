import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FirebaseService } from '../../firebase/firebase.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SharedService } from '../../shared/shared.service';
import { StripePayService } from '../../stripe_pay/stripe-pay.service';
@Component({
  selector: 'app-mem-and-set',
  templateUrl: './mem-and-set.component.html',
  styleUrl: './mem-and-set.component.css'
})
export class MemAndSetComponent implements OnInit, OnDestroy{
  @ViewChild ("newpassword") password_input!:ElementRef;
  @ViewChild ("oldpassword") old_password_input!:ElementRef;
  @ViewChild ("newpasswordconfirm") password_input2!:ElementRef;
  @ViewChild ("newEmail") new_email!:ElementRef;
  @ViewChild ("newName") new_name!:ElementRef;
  user_data: any;
  user_data_subscription:Subscription|undefined;
  oldname:string="";
  membership_text="No paying user";
  oldemail:string="";
  membership_status:string="";
  old_password_status:boolean=false;
  constructor(private fb:FirebaseService, private shared:SharedService, private pay:StripePayService){}
  change_email () {
    var validation = this.shared.valid_email(this.new_email.nativeElement.value);
    if(validation) this.fb.change_email(this.new_email.nativeElement.value);
  }
  async change_password() {
    var alert_message;
    if(this.password_input.nativeElement.value !== "" && this.password_input.nativeElement.value !== null && this.password_input.nativeElement.value !== undefined){
      if(this.password_input2.nativeElement.value !== "" && this.password_input2.nativeElement.value !== null && this.password_input2.nativeElement.value !== undefined){
        if(this.password_input.nativeElement.value === this.password_input2.nativeElement.value) {
          if(this.password_input.nativeElement.value.length > 5){
            if(this.user_data&& this.user_data.Email){
              await this.fb.change_password(this.password_input.nativeElement.value,this.user_data.Email,this.old_password_input.nativeElement.value);
            }
          }
          else {
            alert_message = "password needs more than 6 characters"
          }
        } else alert_message = "passwords do not match";
      } else alert_message = "error with the recurring password";
    } else alert_message = "error with first written password";
    if(alert_message) {
      alert(alert_message);      
    }
  }
  async unsubscripe() {
    await this.pay.endSubscription()
  }
  async subscripe () {
    await this.pay.startCheckout()
  }
  async ngOnInit() {
    this.user_data_subscription=this.shared.userData$?.subscribe(data => {
      if(data){
        this.user_data=data;
        this.oldemail = data.Email;
        this.oldname = data.Name;
        if(data.payment && data.payment.payment_status) this.membership_status = data.payment.payment_status;
        if(this.membership_status){ 
          this.membership_text = "Paying User"
        }
        else {
          this.membership_text = "No paying user";
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.user_data_subscription?.unsubscribe();
  }
}
