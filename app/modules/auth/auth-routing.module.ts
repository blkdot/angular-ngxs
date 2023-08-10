import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthContainerComponent } from "./auth-container/auth-container.component";

const routes: Routes = [
	{
		path: "",
		component: AuthContainerComponent,
		children: [
			{
				path: "",
				loadChildren: () =>
					import("./login/login.module").then((m) => m.LoginModule),
			},
			{
				path: "login",
				loadChildren: () =>
					import("./login/login.module").then((m) => m.LoginModule),
			},
			{
				path: "login-to-continue",
				loadChildren: () =>
					import("./login/login.module").then((m) => m.LoginModule),
			},
			{
				path: "forgot",
				loadChildren: () =>
					import("./forgot/forgot.module").then((m) => m.ForgotModule),
			},
			{
				path: "registration",
				loadChildren: () =>
					import("./registration/registration.module").then(
						(m) => m.RegistrationModule
					),
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
