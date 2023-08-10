import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BounceOnClickDirective } from "./bounce-on-click.directive";
import { ComponentInsertionPointDirective } from "./component-insertion-point.directive";
import { HighlightOnClickDirective } from "./highlight-on-click.directive";
import { IfControlEnabledDirective } from "./if-control-enabled.directive";
import { NgVarDirective } from "./ng-var.directive";

@NgModule({
	declarations: [
		BounceOnClickDirective,
		HighlightOnClickDirective,
		IfControlEnabledDirective,
		NgVarDirective,
		ComponentInsertionPointDirective,
	],
	imports: [CommonModule],
	exports: [
		BounceOnClickDirective,
		HighlightOnClickDirective,
		IfControlEnabledDirective,
		NgVarDirective,
		ComponentInsertionPointDirective,
	],
})
export class SharedDirectivesModule {}
