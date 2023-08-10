import {NgModule} from '@angular/core';
import {AdminRoutingModule} from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PaymentComponent } from './components/payment/payment.component';

@NgModule({
    declarations: [
    
    PaymentComponent
  ],
    imports: [
        SharedModule,
        AdminRoutingModule,
    ]
})

export class AdminModule {
}
