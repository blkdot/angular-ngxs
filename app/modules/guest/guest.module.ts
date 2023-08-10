import { NgModule } from "@angular/core";
import { GuestComponent } from "./guest.component";
import { GuestRoutingModule } from "./guest-routing.module";
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../shared/material.module";
import { AuthHelperViewsModule } from "../auth/auth-helper-views/auth-helper-views.module";

@NgModule({
	declarations: [GuestComponent],
	imports: [
		SharedModule,
		GuestRoutingModule,
		ReactiveFormsModule,
		MaterialModule,
		FormsModule,
		AuthHelperViewsModule,
	],
})
export class GuestModule {}
