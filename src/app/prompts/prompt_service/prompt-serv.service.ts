import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PromptServService {
  constructor() {}
  prompt_value$ = new Subject<any>;
  prompt_question:string|undefined;
  prompt_header:string|undefined;
  prompt_oldvalue:string|undefined;
  status_sub:Subscription|undefined;
  status$ = new BehaviorSubject<any>(null);
  async run_prompt(question: string, header: string, oldvalue?: string) {
      this.prompt_question = question;
      this.prompt_header = header;
      this.prompt_oldvalue = oldvalue || "";
      this.status$.next(true);
      return this.prompt_value$;
  }
   
}