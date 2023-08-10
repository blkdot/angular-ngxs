import { Directive, ElementRef, Input } from "@angular/core";
import { ButtonReactionDirective } from "./button-reaction.directive";

// these represent the x and y scale the element should be transformed to during a press
export const BounceOnClickScalePresets = {
	["default"]: 0.85,
	["main-button"]: 0.93,
	["small-button"]: 0.7,
};

@Directive({
	selector: "[appBounceOnClick]",
})
export class BounceOnClickDirective extends ButtonReactionDirective {
	/**
	 * this represent the x and y scale the element should be transformed to during a press
	 * must be between 0 and 1
	 * if scale is a string, the preset scale with the matching string will be used
	 */
	@Input() bounceOnClickScale: number | keyof typeof BounceOnClickScalePresets =
		BounceOnClickScalePresets.default;

	constructor(readonly element: ElementRef<Element & ElementCSSInlineStyle>) {
		super(element);
		const style = element.nativeElement.style;
		style.willChange = "transform";
		style.transitionProperty = "transform";
		style.transitionDuration = "0.225s";
	}

	protected performPressDownAction() {
		if (this.element.nativeElement.style.transform === this.pressDownTransform)
			return;
		this.element.nativeElement.style.transform = this.pressDownTransform;
	}

	protected performPressUpAction() {
		if (this.element.nativeElement.style.transform === this.pressUpTransform)
			return;
		this.element.nativeElement.style.transform = this.pressUpTransform;
	}

	private get pressDownTransform() {
		return `scale(${this._scaleToUse}, ${this._scaleToUse})`;
	}

	private get pressUpTransform() {
		return "scale(1, 1)";
	}

	private get _scaleToUse() {
		if (typeof this.bounceOnClickScale === "string") {
			const scale = BounceOnClickScalePresets[this.bounceOnClickScale];
			if (typeof scale === "number") {
				return scale;
			}
			return BounceOnClickScalePresets.default;
		} else if (typeof this.bounceOnClickScale === "number") {
			return this.bounceOnClickScale;
		} else {
			return BounceOnClickScalePresets.default;
		}
	}
}
