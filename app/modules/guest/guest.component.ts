import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { first } from "rxjs/operators";
import { CitySearchModel } from "src/app/core/api/api-client.service";
import { ComponentUtils } from "src/app/core/domain/ComponentUtils";
import { GuestSignIn } from "src/app/core/state/auth/auth.actions";
import { CustomValidators } from "src/app/sharedJs/CustomValidators";
import { RefreshProfileState } from "../dash/state/actions/profile.actions";

@Component({
	selector: "app-guest",
	templateUrl: "./guest.component.html",
	styleUrls: ["./guest.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestComponent extends ComponentUtils {
	formGroup: FormGroup;

	constructor(
		private fb: FormBuilder,
		public router: Router,
		private store: Store
	) {
		super();
		this.formGroup = this.fb.group({
			city: [
				"",
				[Validators.required, CustomValidators.ValidateItemFromObjectList],
			],
		});
	}

	guestSignIn() {
		this.formGroup.markAllAsTouched();

		if (!this.formGroup.valid) {
			return;
		}

		const city = this.formGroup.value.city as CitySearchModel;

		this.loadTask(
			() => this.store.dispatch(new GuestSignIn({ cityId: city.id })),
			{ observableType: "hot" }
		)
			.pipe(first())
			.subscribe(() => {
				this.store.dispatch(new RefreshProfileState());
				this.router.navigateByUrl("/app");
			});
	}
}
