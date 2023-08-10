
import {NgModule} from '@angular/core';
import {LoginComponent} from "./login.component";
import {ReactiveFormsModule} from "@angular/forms";
import { SharedModule } from '../../shared/shared.module';
import { AuthHelperViewsModule } from '../auth-helper-views/auth-helper-views.module';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';

const routes: Routes = [
    {path: '', component: LoginComponent},
];



@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        ReactiveFormsModule,
        AuthHelperViewsModule,
        MaterialModule,
    ],
    exports: [LoginComponent],
})
export class LoginModule {

   

}
