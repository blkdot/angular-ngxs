import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from "@angular/core";
import { PopInScreenComponent } from "src/app/modules/shared/components/screens/pop-in-screen/pop-in-screen.component";
import { AppSVGIconsService } from "src/app/modules/shared/service/svg/app-svgicons.service";

@Component({
	selector: "app-order-time-passed-popup",
	templateUrl: "./order-time-passed-popup.component.html",
	styleUrls: ["./order-time-passed-popup.component.scss"],
})
export class OrderTimePassedPopupComponent implements OnInit {
	@ViewChild(PopInScreenComponent)
	private popInScreen: PopInScreenComponent;

	@Input() titleText: string;
	@Input() descriptionText: string;
	@Output() screenDidDismiss = new EventEmitter();

	constructor(readonly svg: AppSVGIconsService) {}

	ngOnInit(): void {}

	get isPresented() {
		return this.popInScreen?.isPresented ?? false;
	}

	present() {
		this.popInScreen?.present();
	}

	dismiss() {
		this.popInScreen?.dismiss();
	}
}
