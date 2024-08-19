import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-naturesounds',
  templateUrl: './naturesounds.component.html',
  styleUrl: './naturesounds.component.css'
})
export class NaturesoundsComponent implements OnInit{
  @Input() player_status:boolean=false;
  @ViewChild ("music_player") music_player!:ElementRef
  current_img:any ="assets/nature/nature_imgs/rain.jpg";
  playing:boolean = false;
  current_title:any = "Title";
  play_button: any = "fa-solid fa-play fa-3x";
  current_mode:number=0;
  modes = [
    {title: "Waves", img:"assets/nature/nature_imgs/waves.jpeg", mp3:"assets/nature/waves.mp3"},
    {title: "Rain", img: "assets/nature/nature_imgs/rain.jpg", mp3:"assets/nature/rain.mp3"},
    {title: "Spring", img: "assets/nature/nature_imgs/spring&birds.jpg", mp3:"assets/nature/birds&spring.mp3"},
    {title: "Wind Chimes", img: "assets/nature/nature_imgs/windchimes.webp", mp3:"assets/nature/windchimes.mp3"}      
  ]
  play():void {
    if (this.music_player) {
      this.play_button = "fa-solid fa-pause fa-3x";
      this.music_player.nativeElement.play();
    }
  }
  pause():void {
    if (this.music_player) {
      this.play_button = "fa-solid fa-play fa-3x";
      this.music_player.nativeElement.pause();
    }
  }
  loop():void {
    this.music_player.nativeElement.currentTime = 1;
    this.music_player.nativeElement.play();
  }
  start_player():void {
    if (this.playing === false) {
      this.play();
    }else {
      this.pause();
    }    
    this.playing = !this.playing;
  }
  async choose_sound(sound:string):Promise<void> {
    switch (sound) {
      case ("waves"): {
        this.current_mode = 0;
        break;   
      }
      case ("rain"): {
        this.current_mode = 1;
        break;   
      }
      case ("springbirds"): {
        this.current_mode = 2;
        break;  
      }
      case("windchimes"): {
        this.current_mode = 3;   
        break;
      };
      default: {
        return
      }
    }   
    this.initialize();
    await this.play()
  }
  initialize() {
    this.music_player.nativeElement.src = this.modes[this.current_mode].mp3;
    this.current_title = this.modes[this.current_mode].title;
    this.current_img = this.modes[this.current_mode].img;
  }
  forward() {
    if(this.current_mode == 3){
      this.current_mode = 0;
    }else {
      this.current_mode++;
    }
    this.initialize();
    this.play()
  }
  backward() {
    if(this.current_mode == 0){
      this.current_mode = 3;
    }else {
      this.current_mode--;
    }
    this.initialize();
    this.play()
  }
  async ngOnInit():Promise<void> {
    await this.music_player
    if(this.music_player){
      this.initialize()
    }
  }
}
