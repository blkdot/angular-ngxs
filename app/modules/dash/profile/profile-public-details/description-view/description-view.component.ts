import { Component, HostBinding, Input, OnInit } from "@angular/core";
import { ComponentUtils } from "src/app/core/domain/ComponentUtils";

const MAX_DESCRIPTION_TEXT_CHARS = 200;

@Component({
	selector: "app-description-view",
	templateUrl: "./description-view.component.html",
	styleUrls: ["./description-view.component.scss"],
})
export class DescriptionViewComponent extends ComponentUtils implements OnInit {
	@Input() descriptionText: string;

	shouldShowMore = false;

	constructor() {
		super();
	}

	ngOnInit(): void {}

	@HostBinding("style.white-space") get whitespace() {
		return this.shouldShowMore ||
			this.descriptionNeedsToBeTruncated(this.descriptionText) === false
			? "pre-line"
			: null;
	}

	descriptionNeedsToBeTruncated(descriptionText: string) {
		descriptionText = descriptionText.trim();
		return (
			descriptionText.length > MAX_DESCRIPTION_TEXT_CHARS ||
			descriptionText.split(/\r\n|\r|\n/).length >= 4
		);
	}

	getTruncatedDescriptionText(descriptionText: string) {
		descriptionText = descriptionText.trim();
		if (
			this.shouldShowMore ||
			this.descriptionNeedsToBeTruncated(descriptionText) === false ||
			descriptionText.length <= MAX_DESCRIPTION_TEXT_CHARS
		) {
			return descriptionText;
		} else {
			return (
				descriptionText.substring(0, MAX_DESCRIPTION_TEXT_CHARS).trim() + "..."
			);
		}
	}
}
