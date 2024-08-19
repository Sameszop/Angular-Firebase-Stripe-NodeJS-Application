import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../firebase/firebase.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  constructor(private fb: FirebaseService, private shared:SharedService){}
  @Output() logging_out = new EventEmitter();
  user_data_sub:Subscription|undefined;
  User_Data:any;
  points:number = 0;
  uid_sub:Subscription|undefined;
  points_sub:Subscription|undefined;
  User_UID:string|undefined;
  Membership_Status:any;
  Payment:any = "No Payment used";
  change_Membership_option:string="Get Membership";
  isWindowOver600px: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
   this.checkWindowSize()
  }
  private checkWindowSize() {
    if(typeof window !== "undefined"){
    	  if (window.innerWidth) {
        this.isWindowOver600px = window.innerWidth > 600;
      }
    }
  }
  async logout(){
    this.fb.logout()
    .then(() => {
      this.logging_out.emit(false)
    })
  }

  change_pic(){  
    const new_pic:HTMLInputElement = document.createElement("input");
    new_pic.type = "file"
    new_pic?.addEventListener("change", async (event) => {
      const selectedFile = event.target as HTMLInputElement
      if(selectedFile.files) {
        const that_file = selectedFile.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(that_file);
        reader.onload = async(event) => {
          if (event.target && typeof reader.result === "string") {
            const img_url = reader.result;
            var db_json = {
              profile_pic:img_url,
            }    
            await this.fb.store_all_data(db_json);
            this.User_Data.profile_pic = img_url;
            this.shared.profilePic$.next(img_url);
          }
        }
      }
    })
    new_pic?.click()
  }
  async ngOnInit() {
    this.checkWindowSize()
    this.user_data_sub = this.shared.userData$?.subscribe(data => {
      this.User_Data = data;
      if(this.User_Data) {
        if(this.User_Data&&this.User_Data.payment&&this.User_Data.payment.payment_status) this.Membership_Status = this.User_Data.payment.payment_status;
      }
      if(this.Membership_Status == null  || this.Membership_Status == false) {
        this.Membership_Status="No Membership"
      }
      else {
        this.Membership_Status = "Paying User"; 
        this.change_Membership_option="Unsubscribe";
      }    
    })
    this.uid_sub = this.shared.uid$?.subscribe(uid => uid? this.User_UID = uid: this.User_UID="");
    this.points_sub = this.shared.points$.subscribe(current_points=> current_points ? this.points = current_points : this.points=0)
  }

  
  async ngOnDestroy() {
    this.user_data_sub?.unsubscribe();
    this.uid_sub?.unsubscribe();
    this.points_sub?.unsubscribe();
  }
}
