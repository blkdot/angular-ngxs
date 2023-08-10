import { NgModule } from "@angular/core";

import { SharedModule } from "../../shared/shared.module";
import { MaterialModule } from "../../shared/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMatIntlTelInputModule } from "ngx-mat-intl-tel-input";
import { MatButtonModule } from "@angular/material/button";
import { AuthPasswordFieldComponent } from "./auth-password-field/auth-password-field.component";
import { AuthCityFieldComponent } from "./auth-city-field/auth-city-field.component";

@NgModule({
	declarations: [AuthCityFieldComponent, AuthPasswordFieldComponent],
	imports: [
		SharedModule,
		MaterialModule,
		MatButtonModule,
		ReactiveFormsModule,
		NgxMatIntlTelInputModule,
	],
	exports: [AuthCityFieldComponent, AuthPasswordFieldComponent],
})
export class AuthHelperViewsModule {}
