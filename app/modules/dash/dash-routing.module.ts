import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{
		path: "products",
		loadChildren: () =>
			import("./products/products.module").then((m) => m.ProductsModule),
	},
	{
		path: "profile",
		loadChildren: () =>
			import("./profile/profile.module").then((m) => m.ProfileModule),
	},
	{
		path: "vendors",
		loadChildren: () =>
			import("./vendors/vendors.module").then((m) => m.VendorsModule),
	},
	{
		path: "my-bag",
		loadChildren: () => import("./bag/bag.module").then((m) => m.BagModule),
	},
	{
		path: "orders",
		loadChildren: () =>
			import("./orders/orders.module").then((m) => m.OrdersModule),
	},
	{
		path: "inventory",
		loadChildren: () =>
			import("./inventory/inventory.module").then(
				(m) => m.InventoryModule
			),
	},
	{
		path: "events",
		loadChildren: () =>
			import("./events/events.module").then((m) => m.EventsModule),
	},
	{
		path: "home",
		loadChildren: () =>
			import("./home-screen/home-screen.module").then(
				(m) => m.HomeScreenModule
			),
	},
	{
		path: "invite",
		loadChildren: () =>
			import("./invite/invite.module").then((m) => m.InviteModule),
	},
	{
		path: "wallet",
		loadChildren: () =>
			import("./wallet/wallet.module").then((m) => m.WalletModule),
	},
	{ path: "**", redirectTo: "home" },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashRoutingModule {}
