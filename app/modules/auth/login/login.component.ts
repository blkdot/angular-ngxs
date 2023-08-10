import { Location } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { first } from "rxjs/operators";
import { ApiClient } from "src/app/core/api/api-client.service";
import { PwdLogin } from "src/app/core/state/auth/auth.actions";
import { UIActions } from "src/app/core/state/ui/ui.actions";
import { UIState } from "src/app/core/state/ui/ui.state";
import { ComponentUtils } from "../../../core/domain/ComponentUtils";
import { RefreshProfileState } from "../../dash/state/actions/profile.actions";
import { AppSVGIconsService } from "../../shared/service/svg/app-svgicons.service";

export type LogInScreenStyle = "regular-screen" | "login-to-continue-popup";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends ComponentUtils {
	formGroup: FormGroup;

	@Input() screenStyle: LogInScreenStyle = "regular-screen";

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private store: Store,
		readonly apiClient: ApiClient,
		readonly location: Location,
		readonly svg: AppSVGIconsService,
		readonly router: Router
	) {
		super();
		this.formGroup = this.fb.group({
			userName: ["", [Validators.required]],
			password: ["", Validators.required],
		});
	}

	hideLogInToContinueScreen() {
		this.store.dispatch(new UIActions.HideLogInToContinueScreen());
	}

	/**
	 * This is the function for submit credentials
	 */
	onTapLogin(): void {
		this.formGroup.markAllAsTouched();

		if (!this.formGroup.valid) {
			return;
		}

		this.loadTask(
			() =>
				this.store.dispatch(
					new PwdLogin({
						userName: this.formGroup.controls.userName.value.trim(),
						password: this.formGroup.controls.password.value,
					})
				),
			{ observableType: "hot" }
		)
			.pipe(first())
			.subscribe(() => {
				const logInToContinueInfo = this.store.selectSnapshot(
					UIState.logInToContinueInfo
				);
				const logInAction = logInToContinueInfo?.onLogInAction;

				// must make sure it's a function just in case it's stored in local storage and is deserialized
				if (typeof logInAction === "function") {
					logInAction();
				}

				const returnUrl =
					this.route.snapshot.queryParams.returnUrl ??
					logInToContinueInfo?.returnUrlPath ??
					"/app";

				this.store.dispatch(new RefreshProfileState());
				this.router.navigateByUrl(returnUrl);
				this.hideLogInToContinueScreen();
			});
	}
}
