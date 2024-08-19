import { Component, EventEmitter, HostListener, OnDestroy, Output } from '@angular/core';
import { OnInit } from '@angular/core'
import { SharedService } from '../../shared/shared.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrl: './music.component.css'
})
export class MusicComponent implements OnInit, OnDestroy{
  isWindowOver600px: boolean|undefined;
  constructor(private shared:SharedService){}
  site:string= "lofi";
  routing:boolean=false;
  current_user:any;
  userSubscription:Subscription|undefined;
  choose_sounds(type:string) {
    this.site = type
  }
  open_window() {
    if(typeof window !== "undefined"){
      const newWindow = window.open(window.location.origin + "/music/player", '_blank', 'width=600px,height=630px,left=200,top=100,toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1');

      if (!newWindow) {
        console.error("Failed to open new window. It might be blocked by a popup blocker.");
      }
    }
  }
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
    this.userSubscription = this.shared.user$.subscribe(user => {
      if(user) {
        this.current_user=user;
      }
    })
  }
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe()
  }
}