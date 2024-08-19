import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-landingheader',
  templateUrl: './landingheader.component.html',
  styleUrl: './landingheader.component.css'
})
export class LandingheaderComponent implements OnInit{
  constructor(private router:Router, private shared:SharedService) {}
  open_sidebar:boolean=false;
  no_pricing:boolean=false;
  login () { 
    if(this.shared.user$.getValue()) {
      this.router.navigate(["/goals"]);
    } 
    else {
      this.router.navigate(["/login"]);
    }
  }
  register () {
    this.router.navigate(["/register"]);
  }
  goRanking() {
    this.router.navigate(["/home/ranking"]);
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
      }
    }
  }
  ngOnInit(): void {
    this.checkWindowSize()
  }
}
