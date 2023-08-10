import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { TermsAndConditionsComponent } from "./terms-and-conditions.component";

const routes: Routes = [
	{
		path: "",
		component: TermsAndConditionsComponent,
	},
];

@NgModule({
	declarations: [TermsAndConditionsComponent],
	imports: [RouterModule.forChild(routes), SharedModule],
})
export class TermsAndConditionsModule {}
