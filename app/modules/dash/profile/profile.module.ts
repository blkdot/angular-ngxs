import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { GeolocationModule } from "../../shared/geolocation/geolocation.module";
import { MaterialModule } from "../../shared/material.module";
import { SharedModule } from "../../shared/shared.module";
import { DashSharedModule } from "../dash-shared/dash-shared.module";
import { EventsModule } from "../events/events.module";
import { ProductsSharedModule } from "../products/products-shared/products-shared.module";
import { VendorHelperViewsModule } from "../vendors/helper-views/vendor-helper-views.module";
import { ProfileEditComponent } from "./profile-edit/profile-edit.component";
import { ProfileRoutingModule } from "./profile-routing.module";
import { ShopProductsScreenComponent } from "./shop-products-screen/shop-products-screen.component";
import { WideUserOptionListHeaderComponent } from "./shop-products-screen/wide-user-option-list-header/wide-user-option-list-header.component";

@NgModule({
	declarations: [
		ProfileEditComponent,
		ShopProductsScreenComponent,
		WideUserOptionListHeaderComponent,
	],
	imports: [
		SharedModule,
		ProductsSharedModule,
		ReactiveFormsModule,
		MaterialModule,
		ProfileRoutingModule,
		EventsModule,
		VendorHelperViewsModule,
		InfiniteScrollModule,
		DashSharedModule,
		GeolocationModule,
	],
})
export class ProfileModule {}
