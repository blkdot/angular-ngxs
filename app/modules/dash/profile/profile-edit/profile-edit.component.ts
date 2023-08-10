import { Location } from "@angular/common";
import { AfterViewChecked, Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngxs/store";
import { filter, first, map, takeUntil } from "rxjs/operators";
import {
	DayOfWeekUI,
	DeliveryTypeUI,
	GenderUI,
	getDisplayNameForDayOfWeek,
	getDisplayNameForDeliveryType,
	StatusUI,
	WhoWillManageFulfillmentUI,
} from "src/app/core/api/ApiEnums";
import { AlertSuccess } from "src/app/core/state/alert/alert.actions";
import { MainSelectInputOption } from "src/app/modules/shared/input-fields/main-select-input/main-select-input.component";
import { EMPTY_UUID, mapOptional } from "src/app/sharedJs/general";
import {
	combineLatestObj,
	mergeIntoObject,
	shareReplayLastUntil,
} from "src/app/sharedJs/observableStuff";
import {
	ApiClient,
	IUserProfileResponse,
	TimeSlot,
	TransportOptionRequest,
	UserProfileEditRequest,
} from "../../../../core/api/api-client.service";
import { ComponentUtils } from "../../../../core/domain/ComponentUtils";
import { SocialProfilesHelpers } from "../../dash-shared/socialProfiles";
import { RefreshProfileState } from "../../state/actions/profile.actions";
import { ProfileState } from "../../state/states/profile.state";
import { ProfileHelpers } from "../profile-helpers";
import { getInitialFormGroup } from "./helpers";
import SocialMediaLinkType = SocialProfilesHelpers.SocialMediaLinkType;

@Component({
	selector: "app-profile-edit",
	templateUrl: "./profile-edit.component.html",
	styleUrls: ["./profile-edit.component.scss"],
})
export class ProfileEditComponent
	extends ComponentUtils
	implements OnInit, AfterViewChecked
{
	readonly maximumBirthday = new Date();

	showSelectLocationScreen = false;

	private readonly userId$ = this.route.params.pipe(
		map((x) => <string | null>(x.id ?? null)),
		filter((x) => typeof x === "string"),
		first(),
		shareReplayLastUntil(this.disposed$)
	);

	readonly templateAsyncValues$ = combineLatestObj({
		userId: this.userId$,
	}).pipe(
		mergeIntoObject(({ userId }) => ({
			profile: this.loadTask(() => this.api.getProfile(userId, EMPTY_UUID)),
			currentUser: this.store
				.select(ProfileState.currentUserProfile)
				.pipe(first()),
		})),
		mergeIntoObject(({ currentUser }) => ({
			isSuperUser: currentUser.isSuperUser,
		})),
		shareReplayLastUntil(this.disposed$)
	);

	readonly formGroup$ = this.templateAsyncValues$.pipe(
		first(),
		map(({ profile }) => getInitialFormGroup(profile, this.disposed$)),
		shareReplayLastUntil(this.disposed$)
	);

	readonly deliveryTimesOptions =
		ProfileHelpers.getAvailableDeliveryTimesOptionsForVendor();

	readonly whoWillManageFulfillmentOptions: MainSelectInputOption[] = [
		{ id: WhoWillManageFulfillmentUI.Swapacrop, name: "Swapacrop" },
		{ id: WhoWillManageFulfillmentUI.MyBusiness, name: "My business" },
	];

	readonly genderOptions: MainSelectInputOption[] = [
		{ id: GenderUI.male, name: "Male" },
		{ id: GenderUI.female, name: "Female" },
	];

	readonly statusOptions: MainSelectInputOption[] = [
		{ id: StatusUI.pending, name: "Pending" },
		{ id: StatusUI.active, name: "Active" },
	];

	readonly wholeSaleOptions: MainSelectInputOption[] = [
		{ id: 1, name: "Yes" },
		{ id: 0, name: "No" },
	];

	readonly canReceiveGifts: MainSelectInputOption[] = [
		{ id: 1, name: "Yes" },
		{ id: 0, name: "No" },
	];

	readonly deliveryOptions = [
		DeliveryTypeUI.Pickup,
		DeliveryTypeUI.Delivery,
	].map((x) => ({ id: x, name: getDisplayNameForDeliveryType(x) }));

	readonly dayOfWeekOptions = [
		DayOfWeekUI.Sunday,
		DayOfWeekUI.Monday,
		DayOfWeekUI.Tuesday,
		DayOfWeekUI.Wednesday,
		DayOfWeekUI.Thursday,
		DayOfWeekUI.Friday,
		DayOfWeekUI.Saturday,
	].map((x) => ({ id: x, name: getDisplayNameForDayOfWeek(x) }));

	constructor(
		private store: Store,
		private location: Location,
		readonly api: ApiClient,
		readonly route: ActivatedRoute,
		readonly fb: FormBuilder,
		readonly el: ElementRef<HTMLElement>
	) {
		super();
	}

	ngOnInit(): void {}

	ngAfterViewChecked(): void {
		// this code prevents chrome from autofilling a username and password into any of the fields in the form
		const inputsInComponent = this.el.nativeElement.querySelectorAll("input");
		inputsInComponent.forEach((x) => {
			x.setAttribute("autocomplete", "new-password");
		});
	}

	submit(): void {
		const formGroup = this.formGroup$.extractSyncValue();
		if (formGroup == null) return;
		formGroup.markAllAsTouched();
		if (formGroup.invalid) return;

		combineLatestObj({
			profile: this.templateAsyncValues$.pipe(
				map((x) => x.profile),
				first()
			),
		})
			.pipe(
				mergeIntoObject(({ profile }) => ({
					__: this.loadTask(() =>
						this.api.updateProfile(this._getEditRequestResult(profile))
					),
				}))
			)
			.pipe(takeUntil(this.disposed$))
			.subscribe(({ profile }) => {
				const onComplete = () => {
					this.store.dispatch(
						new AlertSuccess(`The profile has successfully saved!`)
					);
					this.location.back();
				};

				const currentUser = this.store.selectSnapshot(
					ProfileState.currentUserProfile
				);
				if (currentUser?.id === profile.id) {
					this.loadTask(() => this.store.dispatch(new RefreshProfileState()), {
						observableType: "hot",
					}).subscribe(() => {
						onComplete();
					});
				} else {
					onComplete();
				}
			});
	}

	private _getEditRequestResult(initialValues: IUserProfileResponse) {
		const formGroup = this.formGroup$.extractSyncValue();
		const socialProfiles = (() => {
			return SocialProfilesHelpers.getSocialProfilesFromLinks(
				(
					[
						[SocialMediaLinkType.facebook, "facebookLink"],
						[SocialMediaLinkType.instagram, "instagramLink"],
						[SocialMediaLinkType.twitter, "twitterLink"],
					] as const
				).map(([linkType, controlName]) => [
					<SocialMediaLinkType>linkType,
					<string>formGroup.get(controlName)?.value,
				])
			);
		})();

		const parseNumberElseUndefined = (numText: string) => {
			const x = parseInt(numText);
			if (isNaN(x)) return undefined;
			else return x;
		};

		const formValue = formGroup.value;

		return new UserProfileEditRequest({
			cityId: formValue.city.id,
			email: formValue.email,
			fullName: formValue.fullName,
			displayName: formValue.displayName,
			lat: mapOptional(formValue.lat, (x) => String(x)),
			lng: mapOptional(formValue.lng, (x) => String(x)),
			gender: +formValue.gender,
			status: +formValue.status,
			newPssword: formValue.newPssword,
			oldPssword: formValue.oldPssword,
			phone: formValue.phone,
			photos: formValue.photos,
			userName: formValue.userName.toLowerCase(),
			profileId: initialValues.id,
			percent: +formValue.percent,
			transportOptions: this._getTransportOptionsResult(),
			whoWillManageFulfillment:
				mapOptional(formValue.whoWillManageFulfillment, (x) =>
					parseInt(<any>x)
				) ?? undefined,
			socialProfiles,
			birthDate: formValue.birthDate,
			grantWholesaleAccess: parseInt(<any>formValue.grantWholesaleAccess) === 1,
			canReceiveGifts: parseInt(<any>formValue.canReceiveGifts) === 1,
			orderLeadTimeInDays: parseNumberElseUndefined(
				String(formGroup.value.orderLeadTimeDays)
			),
			orderCutOffTime: formValue.orderCutOffTime ?? undefined,
			businessLat: formValue.businessLocation.latitude ?? undefined,
			businessLng: formValue.businessLocation.longitude ?? undefined,
			description: (() => {
				const x = formValue.profileDescription?.trim();
				if ((x?.length ?? 0) < 1) return null;
				return x;
			})(),
			phyudAddress: formValue.phyudAddress,
			recoveryPhrase: formValue.recoveryPhrase,
			canCashOut: parseInt(<any>formValue.canCashOut) === 1,
			kycVerified: parseInt(<any>formValue.kycVerified) === 1,
		});
	}

	private _getTransportOptionsResult() {
		const formValue = this.formGroup$.extractSyncValue()?.value;
		const deliveryOptions = formValue.deliveryOptions;
		if (
			parseInt(<any>formValue.whoWillManageFulfillment) !==
			WhoWillManageFulfillmentUI.MyBusiness
		)
			return [];
		return [
			...(deliveryOptions.includes(DeliveryTypeUI.Delivery)
				? [
						new TransportOptionRequest({
							type: <any>DeliveryTypeUI.Delivery,
							fee: mapOptional(formValue.deliveryFee, (x) => +x) ?? undefined,
							days: <any>formValue.deliveryDays ?? undefined,
							timeSlots:
								formValue?.deliveryTimes?.map((x) => new TimeSlot(x)) ??
								undefined,
						}),
				  ]
				: []),
			...(deliveryOptions.includes(DeliveryTypeUI.Pickup)
				? [
						new TransportOptionRequest({
							type: <any>DeliveryTypeUI.Pickup,
							fee: mapOptional(formValue.pickupFee, (x) => +x) ?? undefined,
							days: <any>formValue?.pickupDays ?? undefined,
							timeSlots:
								formValue?.pickupTimes?.map((x) => new TimeSlot(x)) ??
								undefined,
						}),
				  ]
				: []),
		];
	}
}
