import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent implements OnInit,OnDestroy{
  logedIn: boolean = true;
  constructor( private shared:SharedService, private router:Router ){}
  UserName:string|undefined;
  competing_users:any;
  rankingArray: any;
  dataSubscription:Subscription|undefined;
  countSubscription:Subscription|undefined;
  pointsSubscription:Subscription|undefined;
  userSubscription:Subscription|undefined;
  picSubscription:Subscription|undefined;
  allUserSubscription:Subscription|undefined;
  createRankingArray(): void {
    this.competing_users.forEach((user:any) => {
      user.totalPoints = user.Points + (user.count.number * 300);
    }); 
    this.rankingArray = this.competing_users.sort((a:any, b:any) => b.totalPoints! - a.totalPoints!);
  }
  ngOnInit() {
    if(this.router.url === "/home/ranking") {
      this.logedIn = false;
    }
    this.allUserSubscription = this.shared.all_users$.subscribe(allUsers => {
      if(allUsers) {
        this.competing_users = Object.values(allUsers);
        this.createRankingArray();
      }
    })
    this.dataSubscription = this.shared.userData$.subscribe(data => {
      if(data) this.UserName = data.Name;
    })
    if(this.competing_users && Array.isArray(this.competing_users)){
      this.picSubscription = this.shared.profilePic$.subscribe(pic => {
        if(pic) {
          this.competing_users.forEach((user: any, index:number) => {
            if(user.Name === this.UserName) {
              this.competing_users[index].profile_pic = pic;
              this.createRankingArray();
            }
          })   
        }
      })
      this.pointsSubscription = this.shared.points$.subscribe(points => {
        if(points) {
          this.competing_users.forEach((user: any, index: number) => {
            if(user.Name === this.UserName) {
              this.competing_users[index].Points = points;                   
              this.createRankingArray();
            }
          });
        }
    });
      this.countSubscription = this.shared.count$.subscribe(count => {
        if(count) {
          this.competing_users.forEach((user: any, index:number) => {
            if(user.Name === this.UserName) {
              this.competing_users[index].count = count;
              this.createRankingArray();
            }
          })
        }
      })
    }
  }
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.allUserSubscription?.unsubscribe();
    this.dataSubscription?.unsubscribe();
    this.picSubscription?.unsubscribe();
    this.pointsSubscription?.unsubscribe();
    this.countSubscription?.unsubscribe();
  }
}