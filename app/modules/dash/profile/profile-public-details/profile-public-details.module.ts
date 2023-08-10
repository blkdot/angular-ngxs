
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsModule } from 'src/app/modules/shared/components/components-shared.module';
import { SharedDirectivesModule } from 'src/app/modules/shared/directives/shared-directives.module';
import { SharedPipesModule } from 'src/app/modules/shared/pipes/shared-pipes.module';
import { DashSharedModule } from '../../dash-shared/dash-shared.module';
import { EventHelperViewsModule } from '../../events/helper-views/event-helper-views.module';
import { ProductsSharedModule } from '../../products/products-shared/products-shared.module';
import { VendorHelperViewsModule } from '../../vendors/helper-views/vendor-helper-views.module';
import { ProfilePublicDetailsComponent } from './profile-public-details.component';
import { DescriptionViewComponent } from './description-view/description-view.component';

const routes: Routes = [
  {path: '', component: ProfilePublicDetailsComponent},
]

@NgModule({
  declarations: [
    ProfilePublicDetailsComponent,
    DescriptionViewComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedPipesModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    ProductsSharedModule,
    EventHelperViewsModule,
    VendorHelperViewsModule,
    DashSharedModule,
  ]
})
export class ProfilePublicDetailsModule { }
