import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent implements OnInit,OnDestroy{
  constructor(private shared:SharedService){}
  site:string= "lofi";
  routing:boolean=false;
  user:any=true;
  user_subscription:Subscription|undefined;
  choose_sounds(type:string) {
    this.site = type
  }
  async ngOnInit(){
    this.user_subscription = this.shared.user$.subscribe(current_user => this.user = current_user || null)     
  }
  ngOnDestroy(): void {
    this.user_subscription?.unsubscribe();
  }
}
