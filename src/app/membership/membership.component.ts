import { Component} from '@angular/core';
import { StripePayService } from '../stripe_pay/stripe-pay.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.css'
})
export class MembershipComponent {
  constructor(private pay:StripePayService) {
  }
  async startMembership(){
    await this.pay.startCheckout()
  }
}
