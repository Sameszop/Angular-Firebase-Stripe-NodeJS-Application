import { Component,  OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PromptServService } from '../prompt_service/prompt-serv.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-prompts',
  templateUrl: './prompts.component.html',
  styleUrl: './prompts.component.css'
})
export class PromptsComponent implements OnInit, OnDestroy{
  constructor(private prompt_serv:PromptServService) {}  
  stat_sub:Subscription|undefined;
  prompt_val:string|undefined;
  prompt_header:string|undefined;
  prompt_question:string|undefined; 
  local_status:boolean = false;
  resolve() {
    this.prompt_serv.prompt_value$.next(this.prompt_val);
    // if(typeof this.prompt_val==="string") {this.prompt_serv.prompt_value$.complete()}
    this.prompt_serv.status$.next(false);
  }
  cancel(){
    try {
      this.prompt_serv.prompt_value$.next(null);
      this.prompt_serv.status$.next(false);
    }catch(e){
      throw new Error("Error in cancel: "+e)
    }
  }
  ngOnInit() {
    this.stat_sub = this.prompt_serv.status$.subscribe(async stat => {
      if(stat != null||stat===false) {
        this.local_status = stat;
        this.prompt_val = this.prompt_serv.prompt_oldvalue||"";
        this.prompt_header = this.prompt_serv.prompt_header||"";
        this.prompt_question = this.prompt_serv.prompt_question||"";
      }
    });
  }
  ngOnDestroy(): void {
    this.stat_sub?.unsubscribe();
  }
}