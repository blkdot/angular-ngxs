import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainAppLoaderComponent } from './main-app-loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [MainAppLoaderComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  exports: [MainAppLoaderComponent],
})
export class MainAppLoaderModule { }
