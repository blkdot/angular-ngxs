import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsRouterPluginModule } from "@ngxs/router-plugin";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { NgxsModule } from "@ngxs/store";
import { environment } from "../../environments/environment";
import { MyBagState } from "../modules/dash/state/states/my-bag.state";
import { ProfileState } from "../modules/dash/state/states/profile.state";
import { ApiClient, API_BASE_URL } from "./api/api-client.service";
import { ErrorInterceptor, JwtInterceptor } from "./interceptors";
import { AlertState } from "./state/alert/alert.state";
import { AuthState } from "./state/auth/auth.state";
import { LocalizationState } from "./state/localization/localization.state";
import { ReusableDataState } from "./state/reusableData/reusableData.state";
import { UIState } from "./state/ui/ui.state";

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		NgxsModule.forRoot(
			[
				AuthState,
				AlertState,
				MyBagState,
				LocalizationState,
				ProfileState,
				UIState,
				ReusableDataState,
			],
			{
				developmentMode: !environment.production,
			}
		),
		NgxsRouterPluginModule.forRoot(),
		NgxsStoragePluginModule.forRoot({
			key: ["auth", "profile", "localization", "myBag", "city"],
		}),
		NgxsReduxDevtoolsPluginModule.forRoot({
			disabled: environment.production,
		}),
		NgxsLoggerPluginModule.forRoot({
			disabled: true,
			collapsed: true,
		}),
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

		{ provide: API_BASE_URL, useValue: environment.api },
		ApiClient,
	],
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error(
				"CoreModule is already loaded. Import it in the AppModule only"
			);
		}
	}
}
