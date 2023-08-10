import { Injectable, NgModule } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterModule,
	RouterStateSnapshot,
	Routes,
} from "@angular/router";
import { Store } from "@ngxs/store";
import { AuthState } from "./core/state/auth/auth.state";
import { AuthGuard } from "./core/_guards/auth.guard";

@Injectable({
	providedIn: "root",
})
export class WildcardRouteGuard implements CanActivate {
	constructor(private router: Router, readonly store: Store) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		if (
			route.url.length === 0 &&
			this.store.selectSnapshot(AuthState.token) == null
		) {
			return true;
		} else {
			this.router.navigate(["/app"]);
			return false;
		}
	}
}

const routes: Routes = [
	{
		path: "success",
		loadChildren: () =>
			import("src/app/modules/success-screen/success-screen.module").then(
				(m) => m.SuccessScreenModule
			),
	},
	{
		path: "auth",
		loadChildren: () =>
			import("src/app/modules/auth/auth.module").then(
				(m) => m.AuthModule
			),
	},
	{
		path: "confirm",
		loadChildren: () =>
			import("src/app/modules/confirm/confirm.module").then(
				(m) => m.ConfirmModule
			),
	},
	{
		path: "app",
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		loadChildren: () =>
			import("src/app/modules/dash/dash.module").then(
				(m) => m.DashModule
			),
	},
	{
		path: "terms-and-conditions",
		loadChildren: () =>
			import(
				"src/app/modules/terms-and-conditions/terms-and-conditions.module"
			).then((x) => x.TermsAndConditionsModule),
	},
	{
		path: "about",
		loadChildren: () =>
			import("src/app/modules/dash/about/about.module").then(
				(m) => m.AboutModule
			),
	},
	{
		path: "**",
		canActivate: [WildcardRouteGuard],
		loadChildren: () =>
			import("src/app/modules/welcome/welcome.module").then(
				(m) => m.WelcomeModule
			),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" }),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
