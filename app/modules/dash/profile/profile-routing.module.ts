import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileEditComponent } from "./profile-edit/profile-edit.component";
import { ShopProductsScreenComponent } from "./shop-products-screen/shop-products-screen.component";

const routes: Routes = [
	{ path: "edit/:id", component: ProfileEditComponent },
	{ path: "shop-products/:userId", component: ShopProductsScreenComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProfileRoutingModule {}
