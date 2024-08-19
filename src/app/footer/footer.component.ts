import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component ({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
  @Input() background_stat:boolean=false;
  isWindowOver600px: boolean|undefined;
  constructor(private router:Router){}
  change_site (new_site:string) {
    this.router.navigate(["/" + new_site]);
  }
  open_email() {
    window.location.href = `mailto:admin@productimate.com`
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
    this.checkWindowSize();
  }
}
