import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { SuccessScreenComponent } from "./success-screen.component";

const routes: Routes = [{ path: "", component: SuccessScreenComponent }];

@NgModule({
	declarations: [SuccessScreenComponent],
	imports: [SharedModule, RouterModule.forChild(routes)],
})
export class SuccessScreenModule {}
