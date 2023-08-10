import { ErrorHandler, NgModule } from "@angular/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { MenuLinkComponent } from "./menu-screen/menu-link/menu-link.component";
import { MenuScreenComponent } from "./menu-screen/menu-screen.component";
import { AdminModule } from "./modules/admin/admin.module";
import { LoginModule } from "./modules/auth/login/login.module";
import { SharedComponentsModule } from "./modules/shared/components/components-shared.module";
import { SharedDirectivesModule } from "./modules/shared/directives/shared-directives.module";
import { MainAppLoaderModule } from "./modules/shared/main-app-loader/main-app-loader.module";
import { SharedPipesModule } from "./modules/shared/pipes/shared-pipes.module";
import { OrderTimePassedPopupComponent } from "./order-time-passed-popup/order-time-passed-popup.component";

@NgModule({
	declarations: [
		AppComponent,
		MenuScreenComponent,
		OrderTimePassedPopupComponent,
		MenuLinkComponent,
	],
	imports: [
		BrowserModule,
		CoreModule,
		AppRoutingModule,
		ServiceWorkerModule.register("ngsw-worker.js", {
			enabled: environment.production,
		}),
		BrowserAnimationsModule,
		NgbModule,
		SharedDirectivesModule,
		SharedPipesModule,
		MatSnackBarModule,
		MainAppLoaderModule,
		LoginModule,
		AdminModule,
		SharedComponentsModule,
		// NgxsReduxDevtoolsPluginModule.forRoot()
	],
	providers: [
		{
			provide: ErrorHandler,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
