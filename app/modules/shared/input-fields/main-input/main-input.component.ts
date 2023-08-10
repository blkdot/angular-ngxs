import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Component({
	selector: "app-main-input",
	templateUrl: "./main-input.component.html",
	styleUrls: ["./main-input.component.scss"],
	host: {
		"(click)": "focus()",
	},
})
export class MainInputComponent implements OnInit {
	@Input() inputTitle: string | null = "title not specified";
	@Input() inputPlaceholder: string | null = "";
	@Input() control: AbstractControl;
	@Input() inputType = "text";
	@ViewChild("inputField") inputField: ElementRef<HTMLInputElement>;
	constructor() {}

	ngOnInit(): void {}

	inputFormControlValue() {
		return this.control instanceof FormControl ? this.control : undefined;
	}

	focus() {
		this.inputField?.nativeElement?.focus();
	}
}
