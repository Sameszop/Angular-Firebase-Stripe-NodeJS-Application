import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';

export const authGuard: CanActivateFn = async(route, state) => {
  return new Promise((res, rej) => {
    const router = inject(Router);
    const shared = inject(SharedService);
    shared.user$.subscribe(user => {
      if(user && user.emailVerified) {
        res(true);
      }
      else if(!user){
        router.navigate(["/login"]);
        shared.previousRoute$.next(state.url)
        rej(false);
      }
      else if(!user.emailVerified){
        router.navigate(["/register/validateEmail"]);
        rej(false)
      }
    })
    shared.userData$.subscribe(data => {
      if(data && data.left_days == 0 && !data.payment.payment_status) {
        router.navigate(["/membership"]);
        alert("Your free trial ended")
        rej(false)
      }
    })
  })
};