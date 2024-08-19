import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { SharedService } from '../shared/shared.service';
import { Subscription } from 'rxjs';
import { PromptServService } from '../prompts/prompt_service/prompt-serv.service';
import { StripePayService } from '../stripe_pay/stripe-pay.service';
@Component({
  selector: 'app-goalpage',
  templateUrl: './goalpage.component.html',
  styleUrls: ['./goalpage.component.css']
})
export class GoalpageComponent implements OnInit, OnDestroy {
  prompt_sub: Subscription|undefined;
  prompt_status: any;
  constructor(private firebase:FirebaseService, private shared:SharedService, private pay:StripePayService,private prompt_serv:PromptServService) {}
  now = new Date();
  today = `${this.now.getDate()}.${this.now.getMonth()}.${this.now.getFullYear()}`;
  MIGs:any;  
  Goals:any;
  Habits:any; 
  point_sub:Subscription|undefined;
  Points:number = 0;
  count:number = 0;
  user_data:any;
  user_data_sub:Subscription|undefined;
  count_obj:any;
  touchTime:number = 0;
  count_sub:Subscription|undefined;
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
  async getPointsPhone(category:string,points:number,id:number,key:string ) {
    if (this.touchTime == 0) {
      // set first click
      this.touchTime = new Date().getTime();
    } 
    else {
      // compare first click to this click and see if they occurred within double click threshold
      if (((new Date().getTime()) - this.touchTime) < 800) {
        if(!this.isWindowOver600px){
          var new_points = this.Points + points;
          if(this.count_obj.change) {
            this.shared.send_count_update(this.count_obj.change);
          }
          await this.remove(id,key,category);
          const db_json = {
            Points:new_points
          }
          await this.firebase.store_all_data(db_json)
        }       
        this.touchTime = 0;
      } 
      else {
        this.touchTime = new Date().getTime();
      }
    } 
  }
  async remove(id:number,key:string,category:string){
    await this.firebase.remove_data(key,category);
    document.getElementById(`div_${category + id}`)?.remove();
  }
  async rename(id:string,key:string,category:string, index?:any){
    const p = document.getElementById(id)
    if(p){
      var prompt_obs = await this.prompt_serv.run_prompt("What is your goal?", "Goals");
      var sub = prompt_obs.subscribe(async new_name => {
        if(!new_name) return;
        if(new_name) sub?.unsubscribe();
        p.textContent = new_name||null;
        var db_json;
        if(category === "Habits"){
          var habit_date = this.Habits[index][1]["Date"]
          db_json = {
            [key]: {
              Name:new_name,
              Date:habit_date          
            }
          }
        }
        else{
          db_json = {
            [key]:new_name,
          }
        }
        if(db_json)await this.firebase.store_all_data(db_json,category)
      })
    }
  }
  async add_Goal(category: string) {
    try {
      var name_obs = await this.prompt_serv.run_prompt("What is your goal?", "Goals");
      var sub = name_obs.subscribe(async name => {
        if(!name) return;
        if(name) sub?.unsubscribe();
        const key: string = `${category}_${Date.now()}`;
        let db_json: { };
        if (category === "Habits") {
          db_json = {
            [key]: { 
              Name: name,
              Date:null,
              Count:0, 
            }
          };
        } else {
          db_json = {
            [key]: name
          };
        }
        await this.firebase.store_all_data(db_json, category);
        var goal_array;
        if(category === "Habits"){
          goal_array = [key,{Name:name}];
          this.Habits.push(goal_array)
        }
        else {
          goal_array = [key,name];
          if(category==="MIG") this.MIGs.push(goal_array);
          else if(category==="Goals") this.Goals.push(goal_array);
        }
      })
    }catch(e) {
      console.log("Error:",e)
    }
  }

  async getPoints(category: any, points: any) {
    try {
      const checkboxes = document.querySelectorAll(`.${category}_checkbox`);
      for (const checkbox of Array.from(checkboxes) as HTMLInputElement[]) {
        if (checkbox.checked) {
          if (this.count_obj.change) {
            this.shared.send_count_update(this.count_obj.change);
          }
          
          const numbers = checkbox.id.match(/\d+/g);
          const index = numbers ? numbers.map(Number)[0] : null;
  
          if (index !== null) {
            let key, name, new_count, database_json;
  
            switch (category) {
              case "MIG":
                key = this.MIGs[index][0];
                await this.remove(index, key, category);
                this.Points += points;
                break;
  
              case "Goals":
                key = this.Goals[index][0];
                await this.remove(index, key, category);
                this.Points += points;
                break;
  
              case "Habits":
                try {
                  key = this.Habits[index][0];
                  name = this.Habits[index][1].Name;
                  document.getElementById(`div_${category + index}`)?.remove();
                  this.Points += points;
  
                  const now = new Date();
                  const date = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`; // Monat +1 da Monate 0-basiert sind
                  new_count = this.Habits[index][1].Count + 1;
  
                  database_json = {
                    [key]: {
                      Name: name,
                      Date: date,
                      Count: new_count
                    },
                  };
  
                  await this.firebase.store_all_data(database_json, `Habits`);
                } catch (e) {
                  console.log("Error: "+e);
                }
                break;
  
              default:
                console.log("No category");
                break;
            }
          }
        }
      }
      this.shared.sendPoints(this.Points);
    } catch (e) {
      console.log("Error in getPoints:", e);
    }
  }
  async ngOnInit(){
    try {
      this.checkWindowSize()
      this.user_data_sub = this.shared.userData$?.subscribe(data => {
        if (data) {
          this.user_data = data;
          this.MIGs = Object.entries(data.MIG || {}); 
          this.Goals = Object.entries(data.Goals || {});
          this.Habits = Object.entries(data.Habits || {});
          this.count = data.count.number || 0;
          this.count_obj = data.count;
          this.count_sub = this.shared.count$.subscribe(new_count => {
            if(new_count){
              this.count = new_count.number;
              this.count_obj = new_count;
            }
          })
        }
      });
      this.prompt_sub = this.prompt_serv.status$.subscribe(stat => {
        if(stat != null) {
          this.prompt_status = stat;
        }
      })
      this.point_sub = this.shared.points$.subscribe(newpoints => {
        if(newpoints) {
          this.Points = newpoints;
        }
      })
    } 
    catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async ngOnDestroy() {
    this.user_data_sub?.unsubscribe();
    this.count_sub?.unsubscribe();
    this.prompt_sub?.unsubscribe();
    this.point_sub?.unsubscribe();
  }
}