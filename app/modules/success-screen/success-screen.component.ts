import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

interface SuccessData {
	title: string;
	description: string;
	image: string;
	buttonTitle: string;
}

@Component({
	selector: "app-success-screen",
	templateUrl: "./success-screen.component.html",
	styleUrls: ["./success-screen.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessScreenComponent {
	readonly data =
		this.assets()[this.activatedRouter.snapshot.queryParams["type"]];

	readonly returnUrl = this.activatedRouter.snapshot.queryParams["returnUrl"];

	constructor(private activatedRouter: ActivatedRoute) {}

	private assets(): Record<string, SuccessData> {
		return {
			join: {
				title: "Thank you!",
				description:
					"Thank you for your interest, we will let you know when your account is approved. If you have used an invitation link your account is already approved!",
				image: "assets/img/thanks/heart.png",
				buttonTitle: "Home",
			},
			product: {
				title: "Thanks!",
				description:
					"A representative will contact you to schedule the product inspection so that the listing can be approved.",
				image: "assets/img/thanks/clumsy.png",
				buttonTitle: "Home",
			},
			order: {
				title: "Your order has been placed!",
				description:
					"Your order has been placed and is on its way to being confirmed and processed.",
				image: "assets/img/thanks/heart.png",
				buttonTitle: "Back to market",
			},
			"order-phyud": {
				title: "Thank you!",
				description:
					"This transaction is pending verification. Once it is verified we will process your order.",
				image: "assets/img/thanks/heart.png",
				buttonTitle: "Home",
			},
			event: {
				title: "Thanks!",
				description: `We will review the event details and let you know once it's approved.`,
				image: "assets/img/thanks/clumsy.png",
				buttonTitle: "Home",
			},
			wholesaleAccess: {
				title: "Thanks!",
				description: "We will notify you once your account has been upgraded.",
				image: "assets/img/happy-lady.png",
				buttonTitle: "Home",
			},
			forgotPassword: {
				title: "Email sent!",
				description: "Please check your email for password instructions.",
				image: "assets/img/happy-lady.png",
				buttonTitle: "Login",
			},
			buyPhyud: {
				title: "Thanks!",
				description: "Your points will be added to your gift card shortly!",
				image: "assets/img/happy-lady.png",
				buttonTitle: "Home",
			},
			givePhyud: {
				title: "Their tokens are on the way!",
				description: "Allow 2-3 business days for processing,",
				image: "assets/img/thanks/clumsy.png",
				buttonTitle: "Home",
			},
			cashOut: {
				title: "Your cash is on the way!",
				description: "Allow 5-7 business days for processing,",
				image: "assets/img/thanks/clumsy.png",
				buttonTitle: "Home",
			},
		};
	}
}
