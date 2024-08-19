import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { GoalpageComponent } from './goalpage/goalpage.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { LongtermgoalsComponent } from './longtermgoals/longtermgoals.component';
// import { MusicComponent } from './music_folder/music/music.component';
import { ProfileComponent } from './profile_folder/profile/profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { LofimusicComponent } from './music_folder/lofimusic/lofimusic.component';
// import { NaturesoundsComponent } from './music_folder/naturesounds/naturesounds.component';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { LandingpageComponent } from './landingpage_folder/landingpage/landingpage.component';
import { MemAndSetComponent } from './profile_folder/mem-and-set/mem-and-set.component';
import { PersonalInfoComponent } from './profile_folder/personal-info/personal-info.component';
import { PromptsComponent } from './prompts/prompt_component/prompts.component';
// import { PlayerComponent } from './music_folder/player/player.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { RankingComponent } from './ranking/ranking.component';
import { MembershipComponent } from './membership/membership.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { LandingheaderComponent } from './landingpage_folder/landingheader/landingheader.component';
import { EmailVerifyComponent } from './authentication/email-verify/email-verify.component';
import { TermsOfUsageComponent } from './policies/terms-of-usage/terms-of-usage.component';
import { PrivacyPolicyComponent } from './policies/privacy-policy/privacy-policy.component';
// Firebase configuration object
@NgModule({
  declarations: [
    AppComponent,
    GoalpageComponent,
    HeaderComponent,
    FooterComponent,
    LongtermgoalsComponent,
    // MusicComponent,
    ProfileComponent,
    // LofimusicComponent,
    // NaturesoundsComponent,
    LandingpageComponent,
    MemAndSetComponent,
    PersonalInfoComponent,
    PromptsComponent,
    // PlayerComponent,
    LoginComponent,
    RegisterComponent,
    RankingComponent,
    MembershipComponent,
    LandingheaderComponent,
    EmailVerifyComponent,
    TermsOfUsageComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi(),withFetch()),
    provideFirebaseApp(() => initializeApp({"projectId":"tribes-a282c","appId":"1:595173085054:web:b0b5555a359d4629b1ad2f","databaseURL":"https://tribes-a282c-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"tribes-a282c.appspot.com","apiKey":"AIzaSyCB3WsYdSE-UVxA6d2FvaH80qMYrd3kvRU","authDomain":"tribes-a282c.firebaseapp.com","messagingSenderId":"595173085054","measurementId":"G-1Y8WJW3YF7"})),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
