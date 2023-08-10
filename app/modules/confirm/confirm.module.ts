import { NgModule } from '@angular/core';
import { ConfirmComponent } from './confirm/confirm.component';
import {ConfirmRoutingModule} from "./confirm-routing.module";
import { ConfirmProductComponent } from './confirm-product/confirm-product.component';
import {ConfirmEventComponent} from "./confirm-event/confirm-event.component";
import { SharedModule } from '../shared/shared.module';
import {ConfirmAccessComponent} from "./confirm-access/confirm-access.component";

@NgModule({
  declarations: [
      ConfirmComponent,
      ConfirmProductComponent,
      ConfirmEventComponent,
      ConfirmAccessComponent
  ],
  imports: [
      SharedModule,
      ConfirmRoutingModule
  ]
})
export class ConfirmModule { }
