import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoalpageComponent } from './goalpage/goalpage.component';
import { LongtermgoalsComponent } from './longtermgoals/longtermgoals.component';
import { ProfileComponent } from './profile_folder/profile/profile.component';
import { LandingpageComponent } from './landingpage_folder/landingpage/landingpage.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { RankingComponent } from './ranking/ranking.component';
import { MembershipComponent } from './membership/membership.component';
import { authGuard } from './guards/auth.guard';
import { EmailVerifyComponent } from './authentication/email-verify/email-verify.component';
import { PrivacyPolicyComponent } from './policies/privacy-policy/privacy-policy.component';
import { TermsOfUsageComponent } from './policies/terms-of-usage/terms-of-usage.component';

const routes: Routes = [
  {path: "goals", component:GoalpageComponent, canActivate:[authGuard]},
  {path: "long-term-goals", component:LongtermgoalsComponent, canActivate:[authGuard]},
  // {path: "music", component:MusicComponent, canActivate:[authGuard]},
  {path: "profile", component:ProfileComponent, canActivate:[authGuard]},
  {path: "", component:LandingpageComponent},
  // {path: "music/player", component:PlayerComponent, canActivate:[authGuard]},
  {path:"home", component:LandingpageComponent},
  {path:"login", component:LoginComponent},
  {path:"register", component:RegisterComponent},
  {path:"ranking", component:RankingComponent, canActivate:[authGuard]},
  {path:"membership", component:MembershipComponent},
  {path:"register", component:RegisterComponent},
  {path:"home/ranking", component:RankingComponent},
  {path:"register/validateEmail", component:EmailVerifyComponent},
  {path:"privacy-policy", component:PrivacyPolicyComponent},
  {path:"terms-of-usage", component:TermsOfUsageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}