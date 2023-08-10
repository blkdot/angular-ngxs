import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { SharedComponentsModule } from './components/components-shared.module';
import { InputFieldsModule } from './input-fields/input-fields.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule, 
    SharedComponentsModule,
    SharedPipesModule,
    SharedDirectivesModule,
    InputFieldsModule,
  ]
})
export class SharedModule { }
