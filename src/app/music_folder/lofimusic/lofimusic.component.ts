import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-lofimusic',
  templateUrl: './lofimusic.component.html',
  styleUrl: './lofimusic.component.css'
})
export class LofimusicComponent implements OnInit{
  @Input() player_status:boolean=false;
  song_title:string|undefined;
  play_state:boolean = false;
  lofi_img:any;
  song_artist:string | undefined=""
  @ViewChild('audio_elem') audio_elem!:ElementRef;
  play_button: string = "fa-solid fa-play fa-3x";
  artist_credit:string|undefined|null;

  images: string[] = [
    "assets/lofi/img/lofi1.jpeg",
    "assets/lofi/img/lofi2.jpeg",
    "assets/lofi/img/lofi3.jpeg",
    "assets/lofi/img/lofi4.jpeg",
    "assets/lofi/img/lofi5.jpeg",
  ]
  songs =[
    {
      title: 'free lofi beat',
      src: 'assets/lofi/free lofi beat quotradiationquot.mp3',
      artist:"quotrdiatiionquot"
    },
    {
      title: 'Good Night ',
      src: 'assets/lofi/Good Night -- FASSounds.mp3',
      artist: "FASSounds"
    },
    {
      title:"instrumental lofi",
      src:"assets/lofi/instrumental lofi tranquilas.mp3",
      artist:"tranquilas"
    },
    {
      title: 'lofi relax hi',
      src: 'assets/lofi/lofi relax hi -- lofium.mp3',
      artist: "lofium"
    },
    {
      title: 'lofi relax music',
      src: 'assets/lofi/lofi relax music -- lofium.mp3',
      artist: "lofium"
    },

    {
      title: 'lofi song elegance',
      src: 'assets/lofi/lofi song elegance -- lofium.mp3',
      artist:"lofium"
    },
    {
      title: 'lofi song nature',
      src: 'assets/lofi/lofi song nature -- lofium.mp3',
      artist:"lofium"
    },
    {
      title: 'lofi-study',
      src: 'assets/lofi/lofi-study -- FASSounds.mp3',
      artist:"FASSounds"
    },
    {
      title:"tokyo cafe",
      src:"assets/lofi/tvari tokyo cafe.mp3",
      artist:"tvari"
    },
    {
      title:"reverie",
      src:"assets/lofi/scott-buckley-reverie.mp3",
      artist:"Scott Buckley",
      credits:`Reverie by Scott Buckley | www.scottbuckley.com.au
      Music promoted by https://www.chosic.com/free-music/all/
      Creative Commons CC BY 4.0
      https://creativecommons.org/licenses/by/4.0/
      `
    },
    {
      title:"Permafrost",
      artist:"Scott Buckley",
      src:"assets/lofi/scott-buckley-permafrost.mp3",
      credits:`Permafrost by Scott Buckley | www.scottbuckley.com.au
      Music promoted by https://www.chosic.com/free-music/all/
      Creative Commons CC BY 4.0
      https://creativecommons.org/licenses/by/4.0/
      `
    },
    {
      title:"Healing (Spheriá Rework)",
      artist:"Spheriá",
      src:"assets/lofi/Eternall-Healing-Spheria.mp3",
      credits:`Healing (Spheriá Rework) by Spheriá | https://soundcloud.com/spheriamusic
      Music promoted by https://www.chosic.com/free-music/all/
      Creative Commons CC BY-SA 3.0
      https://creativecommons.org/licenses/by-sa/3.0/
      `
    },
    {
      title: "I Walk With Ghosts",
      artist:"Scott Buckley",
      src:"assets/lofi/scott-buckley-i-walk-with-ghosts.mp3",
      credits:`I Walk With Ghosts by Scott Buckley | www.scottbuckley.com.au
      Music promoted by https://www.chosic.com/free-music/all/
      Creative Commons Attribution 4.0 International (CC BY 4.0)
      https://creativecommons.org/licenses/by/4.0/
      `
    },
    {
      title:"Evening Improvisation",
      artist:"Spheriá & Ethera",
      src:"assets/lofi/Evening-Improvisation-with-Ethera.mp3",
      credits:`Evening Improvisation (with Ethera) by Spheriá | https://soundcloud.com/spheriamusic
      Music promoted by https://www.chosic.com/free-music/all/
      Creative Commons CC BY-SA 3.0
      https://creativecommons.org/licenses/by-sa/3.0/
      `
    },
    {
      title:"MANTRA",
      artist:"Alex-Productions",
      src:"assets/lofi/MANTRA-alex-productions.mp3",
      credits:`MANTRA by Alex-Productions | https://onsound.eu/
      Music promoted by https://www.chosic.com/free-music/all/
      Creative Commons CC BY 3.0
      https://creativecommons.org/licenses/by/3.0/
      `
    }
  ]
  song_index:number = 0;
  play() {
    this.play_button = "fa-solid fa-pause fa-3x"
    this.audio_elem.nativeElement.play()
  }
  pause() {
    this.play_button = "fa-solid fa-play fa-3x"
    this.audio_elem.nativeElement.pause()
  }
  player() {
    if(this.play_state){
      this.pause()
    }else{
      this.play()
    }
    this.play_state = ! this.play_state
  }
  forward() {
    if(this.song_index < this.songs.length - 1){
      this.song_index != this.songs.length ? this.song_index++ : null;
      this.audio_elem.nativeElement.src = this.songs[this.song_index].src;
      this.song_title = this.songs[this.song_index].title
      this.songs[this.song_index].artist ? this.song_artist = this.songs[this.song_index].artist : this.song_artist = "unknown";
      this.songs[this.song_index].credits ? this.artist_credit = this.songs[this.song_index].credits : this.artist_credit=null;
      this.play()
    }
    else{
      this.shuffel()
    }
  }
  backward() {
    if(this.song_index < this.songs.length - 1){
      this.song_index!=0 ? this.song_index-- : null;
      this.audio_elem.nativeElement.src = this.songs[this.song_index].src;
      this.song_title = this.songs[this.song_index].title;
      this.songs[this.song_index].artist ? this.song_artist = this.songs[this.song_index].artist : this.song_artist = "unknown";
      this.songs[this.song_index].credits ? this.artist_credit = this.songs[this.song_index].credits : this.artist_credit=null;
      this.play()
    }else {
      this.shuffel()
    }
  }
  shuffel() {
    for(let i = this.songs.length-1; 0 < i; i--) {
      const random: number = Math.floor(Math.random() * (1+i));
      [this.songs[i], this.songs[random]] = [this.songs[random], this.songs[i]];
      this.song_index = 0;
    }
  }
  begin () {
    this.audio_elem.nativeElement.currentTime = 0;
  }
  radom_picture() {
    const random = Math.floor(Math.random() * (this.images.length -1))
    this.lofi_img=this.images[random];
  }
  show_credits() {
    alert(this.artist_credit)
  }
  async ngOnInit () {
    await this.shuffel()
    await this.radom_picture()
    await this.audio_elem
    if(this.song_index < this.songs.length - 1){
      this.audio_elem.nativeElement.src = this.songs[this.song_index].src;
      this.song_title = this.songs[this.song_index].title;
      this.songs[this.song_index].artist ? this.song_artist = this.songs[this.song_index].artist : this.song_artist = "unknown";
      this.songs[this.song_index].credits ? this.artist_credit = this.songs[this.song_index].credits : this.artist_credit=null;
    }
  }
}