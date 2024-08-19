import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StripePayService } from '../stripe_pay/stripe-pay.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(private router:Router, private pay:StripePayService, private shared:SharedService){}
  change_site(site:string){
    this.router.navigate(["/"+ site])
  }
  open_email() {
    window.location.href = `mailto:mailto:admin@productimate.com`
  }
  @Input () background_stat:boolean=false;
  membership_status:boolean=true;
  left_days:number=15;
  open_sidebar:boolean=false
  isWindowOver600px: boolean = true;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
   this.checkWindowSize()
  }
  private checkWindowSize() {
    if(typeof window !=="undefined"){
    	  if (window.innerWidth) {
        this.isWindowOver600px = window.innerWidth > 600;
      }
    }
  }
  getMembership() {
    this.pay.startCheckout()
  }
  checkdays() {

  }
  ngOnInit(): void {
    this.checkWindowSize()
    this.shared.userData$.subscribe(data => {
      if(data) {
        if(data.payment && data.payment.payment_status) {
          this.membership_status = true;
        }
        else {
          this.membership_status = false;
          if(data.left_days) this.left_days = data.left_days;
        }
      } 
    })
  }
}