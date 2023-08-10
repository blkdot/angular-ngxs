import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConfirmComponent} from './confirm/confirm.component';
import {ConfirmProductComponent} from "./confirm-product/confirm-product.component";
import {ConfirmEventComponent} from "./confirm-event/confirm-event.component";
import {ConfirmAccessComponent} from "./confirm-access/confirm-access.component";

const routes: Routes = [
    {path: 'user', component: ConfirmComponent},
    {path: 'product', component: ConfirmProductComponent},
    {path: 'event', component: ConfirmEventComponent},
    {path: 'access', component: ConfirmAccessComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfirmRoutingModule {
}
