import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import {HttpClientModule} from "@angular/common/http";
import { SharedModule } from '../shared/shared.module';
import { AuthContainerComponent } from './auth-container/auth-container.component';


@NgModule({
  declarations: [
    AuthContainerComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    HttpClientModule,
  ]
})
export class AuthModule { }
