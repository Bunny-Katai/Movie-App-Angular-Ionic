import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { LoginFormComponent } from './login-form/login-form/login-form.component';
import { RegisterPage } from './register/register.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    RouterModule.forChild([
      { path: '', component: ProfilePage },
      { path: 'register', component: RegisterPage }
    ])
  ],
  declarations: [ProfilePage, LoginFormComponent, RegisterPage]
})
export class ProfileModule {}
