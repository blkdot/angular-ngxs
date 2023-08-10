import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxMatIntlTelInputModule } from "ngx-mat-intl-tel-input";
import { SharedComponentsModule } from "../components/components-shared.module";
import { SharedDirectivesModule } from "../directives/shared-directives.module";
import { MaterialModule } from "../material.module";
import { DateInputComponent } from "./data-specific-inputs/date-input/date-input.component";
import { LocationInputComponent } from "./data-specific-inputs/location-input/location-input.component";
import { MultiDateInputComponent } from "./data-specific-inputs/multi-date-input/multi-date-input.component";
import { SelectCityInputComponent } from "./data-specific-inputs/select-city-input/select-city-input.component";
import { TimeInputComponent } from "./data-specific-inputs/time-input/time-input.component";
import { UsersOptionListComponent } from "./data-specific-inputs/users-option-list/users-option-list.component";
import { MainInputHolderComponent } from "./main-input-holder/main-input-holder.component";
import { MainInputWithDropdownComponent } from "./main-input-with-dropdown/main-input-with-dropdown.component";
import { MainInputComponent } from "./main-input/main-input.component";
import { MainMultiSelectInputComponent } from "./main-multi-select-input/main-multi-select-input.component";
import { MainMultilineInputComponent } from "./main-multiline-input/main-multiline-input.component";
import { MainSelectInputComponent } from "./main-select-input/main-select-input.component";
import { PropertyInfoComponent } from "./property-info/property-info.component";

@NgModule({
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	declarations: [
		DateInputComponent,
		MultiDateInputComponent,
		SelectCityInputComponent,
		TimeInputComponent,
		MainInputComponent,
		MainInputHolderComponent,
		MainInputWithDropdownComponent,
		MainMultilineInputComponent,
		MainSelectInputComponent,
		UsersOptionListComponent,
		PropertyInfoComponent,
		MainMultiSelectInputComponent,
		LocationInputComponent,
	],
	imports: [
		SharedComponentsModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedDirectivesModule,
		MaterialModule,
		NgxMatIntlTelInputModule,
	],
	exports: [
		DateInputComponent,
		MultiDateInputComponent,
		SelectCityInputComponent,
		TimeInputComponent,
		MainInputComponent,
		MainInputHolderComponent,
		MainInputWithDropdownComponent,
		MainMultilineInputComponent,
		MainSelectInputComponent,
		UsersOptionListComponent,
		PropertyInfoComponent,
		MainMultiSelectInputComponent,
		LocationInputComponent,
	],
})
export class InputFieldsModule {}
