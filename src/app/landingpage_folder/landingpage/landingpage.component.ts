import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent implements OnInit{
  constructor(private router:Router) {}
  open_sidebar:boolean=false;
  img_obj:any= {
    Goal: "assets/img/Goal_screen.png",
    LTG: "assets/img/LTG_screen.png",
    Music: "assets/img/Ranking_screen.png",
  }
  no_pricing:boolean=false;
  login (){
    this.router.navigate(["/login"]);
  }
  register () {
    this.router.navigate(["/register"]);
  }
  isWindowOver600px: boolean = true;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
   this.checkWindowSize()
  }
  private checkWindowSize() {
    if(typeof window !=="undefined"){
    	  if (window.innerWidth) {
         this.isWindowOver600px = window.innerWidth > 600;
         if(!this.isWindowOver600px) {
          this.img_obj= {
            Goal: "assets/img/Goal_screen_phone.png",
            LTG: "assets/img/LTG_screen_phone.png",
            Music: "assets/img/Ranking_screen_phone.png",
          }
         }
         else{
          this.img_obj= {
            Goal: "assets/img/Goal_screen.png",
            LTG: "assets/img/LTG_screen.png",
            Music: "assets/img/Ranking_screen.png",
          }
         }
      }
    }
  }
  ngOnInit(): void {
    this.checkWindowSize()
  }
}
