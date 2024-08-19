import { Component, EventEmitter, OnInit, Output, Input, OnDestroy, HostListener } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';
import { last, Subscription } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { PromptServService } from '../prompts/prompt_service/prompt-serv.service';
@Component({
  selector: 'app-longtermgoals',
  templateUrl: './longtermgoals.component.html',
  styleUrls: ['./longtermgoals.component.css']
})
export class LongtermgoalsComponent implements OnInit, OnDestroy{
  prompt_sub: Subscription|undefined;
  prompt_status: boolean=false;
  count_obj: any;
  count:number = 0;
  count_sub: Subscription|undefined;
  constructor(private fire:FirebaseService, private shared:SharedService, private prompt_serv:PromptServService){}
  user_data:any;
  standard_img:any;
  data_sub:Subscription|undefined;
  LTGs:any[]=[];
  Points:number = 0;
  points_sub:Subscription|undefined;
  touchTime:number=0;
  async add_LTG() {
    var prompt_obs = await this.prompt_serv.run_prompt("What is your new long-term-goal?", "Long Term Goals");
    const sub = prompt_obs.subscribe(async (new_name: string | null) => {
        if (!new_name) return;
        const key: string = `LTG_${Date.now()}`;
        const db_json = {
          [key]: {
            Name: new_name,
            img: "assets/img/LTG_default.png",
            steps: {}
          }
        };

        await this.fire.store_all_data(db_json, "LTG");
        const LTG_ary = [key, { Name: new_name, img: "assets/img/LTG_default.png" }];
        this.LTGs?.push(LTG_ary);
        sub.unsubscribe()
    });
  }
  async add_Steps(key:string,index:number) {
    var prompt_obs = await this.prompt_serv.run_prompt("What is the new step?", "Steps");
    var sub = prompt_obs.subscribe(async (name: string | null) => {
      if(!name) return;
      if(name) sub?.unsubscribe();
      const step_key = `step_${Date.now()}`;
      var db_json = {
        [step_key]:name,
      }
      await this.fire.store_all_data(db_json,`LTG/${key}/steps`);
      var step_array = [step_key, name];
      if(Array.isArray(this.LTGs[index][1].steps)) {this.LTGs[index][1].steps.push(step_array)}
      else { 
        this.LTGs[index][1].steps= []; 
        this.LTGs[index][1].steps.push(step_array);
      }
      this.LTGs=this.LTGs;
    })
  }
  async change_Name(key:string, index:any, category:string, LTG_key?:string) {
    var question;
    category ==="steps" ? question = "how do you call this step?" : question = "how do you call this long-term-goal?"
    var prompt_obs = await this.prompt_serv.run_prompt(question, "Goals");
    var sub = prompt_obs.subscribe(async (new_name: string | null) => {
      if(!new_name) return;
      if(new_name) sub?.unsubscribe();
      const current_img = this.LTGs[index][1].img;
      const current_steps = this.LTGs[index][1].steps;
      var db_json;
      var path;
      if(category !== "steps") {
        db_json = {
          [key]:{
            Name:new_name,
            img: current_img,
            steps: current_steps
          }
        }
        path = `LTG`;
      }
      else {
        db_json= {key:new_name}; 
        path = `LTG/${LTG_key}/steps`;
      }   
      await this.fire.store_all_data(db_json, path);
      const p = document.getElementById(`p_${key}`)
      p ? p.textContent = new_name : null
    })
  }
  isStepsArrayAndNotEmpty(steps: any): boolean {
    return (Array.isArray(steps) && steps.length > 0)|| steps != null ;
  }
  async remove (key:string,path?:string,LTG_index?:number,step_index?:number) {
    try {
      var LTG_path = path ? `LTG/${path}/steps` : "LTG";
      await this.fire.remove_data(key,LTG_path);
      const div = document.getElementById(`div_${key}`);
      div ? div.remove() : null;
      if(typeof LTG_index === "number" && typeof step_index === "number"){
        var steps = this.LTGs[LTG_index][1].steps as any[]|null;
        this.LTGs[LTG_index][1].steps.splice(step_index);
        if(steps && Array.isArray(steps) && steps.length < 1) {
          this.LTGs[LTG_index][1].steps.splice(step_index);
          console.log(this.LTGs[LTG_index][1].steps);
          this.LTGs[LTG_index][1].steps=null;
        }
      }
    }
    catch(e){
      console.error("Error:",e)
    }
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
  async getPointsPhone(LTG_key:string, step_key:string, LTG_id:number, step_id:number ) {
    if (this.touchTime == 0) {
      // set first click
      this.touchTime = new Date().getTime();
    } 
    else {
      // compare first click to this click and see if they occurred within double click threshold
      if (((new Date().getTime()) - this.touchTime) < 800) {
        if(!this.isWindowOver600px){
          if(this.count_obj.change) {
            this.shared.send_count_update(this.count_obj.change);
          }
          await this.remove(step_key,LTG_key,LTG_id,step_id);
          await this.shared.sendPoints(this.user_data.Points + 200);
        }       
        this.touchTime = 0;
      } 
      else {
        this.touchTime = new Date().getTime();
      }
    }

  }
  async get_Points(LTG_key:string, LTG_index:number){
    const checkboxes = document.querySelectorAll(`.${LTG_key}_checkbox`);
    var num = this.user_data.Points;
    var new_points = num; 
    Array.from(checkboxes).forEach(async (checkbox: any, step_index:number) => {
      if (checkbox.checked) {
        var step_key = this.LTGs[LTG_index][1].steps[step_index][0];
        if(this.count_obj.change) {
          this.shared.send_count_update(this.count_obj.change);
        }
        const numbers = checkbox.id.match(/\d+/g);
        numbers ? numbers.map(Number) : [];
        new_points += 200;
        await this.remove(step_key,LTG_key,LTG_index,step_index)
      }
    }); 
    this.shared.sendPoints(new_points);
  }

  change_pic(key:any){  
    const new_pic:HTMLInputElement = document.createElement("input")
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
              img:img_url,
            }    
            await this.fire.store_all_data(db_json,`LTG/${key}`);
            const img_elem = document.getElementById(`img_${key}`);
            if(img_elem)img_elem.setAttribute("src",img_url);
          }
        }
      }
    })
    new_pic?.click()
  }
  change_vision(key:string,index:number) {
    const step_container = document.getElementById(`step_container_${key}`)
    const icon = document.getElementById(`icon_${key}`)
    var vision:boolean = this.LTGs[index][1].visual
    if(!vision) {     
      step_container ? step_container.style.display="none" : null;
      icon?.classList.remove("fa-solid", "fa-2x", "fa-caret-down")
      icon?.classList.add("fa-solid", "fa-2x", "fa-caret-left")
    }else{
      step_container ? step_container.style.display="block" : null;
      icon?.classList.remove("fa-solid", "fa-2x", "fa-caret-left")
      icon?.classList.add("fa-solid", "fa-2x", "fa-caret-down")
    }
    this.LTGs[index][1].visual=!this.LTGs[index][1].visual;
  }
  async ngOnInit() {
    this.LTGs = [];
    this.checkWindowSize()
    this.data_sub = this.shared.userData$?.subscribe(data => {
      if(data){
        this.user_data = data;
        var LTG_array;
        if(typeof data.LTG === "object") {LTG_array = Object.entries(data.LTG);}
        LTG_array?.forEach((LTG:any) => {
          if (LTG[1].steps && !Array.isArray(LTG[1].steps)) { // Check if steps is not already an array
            LTG[1].steps = Object.entries(LTG[1].steps);
          }
        })
        if(LTG_array) this.LTGs = LTG_array;
        this.LTGs?.forEach((LTG:any) => {
          LTG[1].visual = false;
        })
        this.count = data.count.number || 0;
        this.count_obj = data.count;
        this.count_sub = this.shared.count$.subscribe(new_count => {
          if(new_count){
            this.count = new_count.number;
            this.count_obj = new_count;
          }
        })
      }
    })
    this.prompt_sub = this.prompt_serv.status$.subscribe(stat => {
      if(stat != null) {
        this.prompt_status = stat;
      }
    })  
    this.points_sub = this.shared.points$.subscribe(new_points => {
      if(new_points) {
        this.Points = new_points;
      }
    })
  }
  async ngOnDestroy() {
    this.data_sub?.unsubscribe();
    this.points_sub?.unsubscribe();
    this.prompt_sub?.unsubscribe();
    this.count_sub?.unsubscribe()
  }
}