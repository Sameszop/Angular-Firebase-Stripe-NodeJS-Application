import { Component, Input, OnInit, HostListener } from '@angular/core';
import { FirebaseService } from '../../firebase/firebase.service';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  constructor(private fb:FirebaseService, private shared:SharedService, private router:Router){}
  @Input() user_data:any;
  current_site:string = "personal";
  isWindowOver600px: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize();
  }

  private checkWindowSize() {
    if(typeof window !== "undefined"){
    if (window.innerWidth) {
      this.isWindowOver600px = window.innerWidth > 600;
    }}
  }
  async logout(){
    await this.fb.logout()
    .then(() => {
      this.shared.user$.next(false);
      this.router.navigate(["/home"]);
    })
  }
  change_site(newsite:string) {
    this.current_site=newsite;
  }
  async ngOnInit() {
    this.checkWindowSize();
  }
}