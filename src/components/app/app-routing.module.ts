import { Routes, RouterModule, CanActivate } from '@angular/router';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PersonComponent } from './person-signup/person-signup.component';
import { PetComponent } from './pet-signup/pet-signup.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { PersonBooleanComponent } from './person-boolean/person-boolean.component';
import { PetDashboardComponent } from './pet-dashboard/pet-dashboard.component';
import { ReviewComponent } from './review/review.component';
import { PetBooleanComponent } from './pet-boolean/pet-boolean.component';
import { ChatComponent } from './chat/chat.component';
import { PageNotFoundComponent } from './page-not-found';
import { AuthGuard } from './auth/auth.gard';
import { ProfileComponent } from './profile/profile.component';
import { CallbackComponent } from './callback.component';


const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'person-signup', component: PersonComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'pet-signup', component: PetComponent, canActivate: [AuthGuard] },
  { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard] },
  { path: 'pet-dashboard/:id', component: PetDashboardComponent, canActivate: [AuthGuard] },
  // { path: 'pet-dashboard', component: PetDashboardComponent, canActivate: [AuthGuard] },
  { path: 'review', component: ReviewComponent, canActivate: [AuthGuard] },
  { path: 'pet-boolean', component: PetBooleanComponent, canActivate: [AuthGuard] },
  { path: 'person-boolean', component: PersonBooleanComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: '#', component: PetComponent },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { useHash: true }
      // { enableTracing: true } // <-- debugging purposes only
    )

  ],
  providers: [AuthGuard],
  exports: [
    RouterModule]
})
export class AppRoutingModule { }

/*Here is the first configuration. Pass the array of routes, appRoutes, to the RouterModule.forRoot method.
It returns a module, containing the configured Router service provider, plus other providers that the routing library requires.
Once the application is bootstrapped, the Router performs the initial navigation based on the current browser URL.*/
