import { Validators } from "@angular/forms";
import { IFormGroup } from "@rxweb/types";
import dayjs from "dayjs";
import { Observable } from "rxjs";
import {
	DeliveryType,
	ICitySearchModel,
	IUserProfileResponse,
} from "src/app/core/api/api-client.service";
import {
	DayOfWeekUI,
	DeliveryTypeUI,
	WhoWillManageFulfillmentUI,
} from "src/app/core/api/ApiEnums";
import { TimeRangeValue } from "src/app/modules/shared/input-fields/data-specific-inputs/time-input/time-input.component";
import { CustomValidators } from "src/app/sharedJs/CustomValidators";
import { TFormBuilder, TFormControl } from "src/app/sharedJs/formTyping";
import { fix_Dec31_0515_ApiDateIssue } from "src/app/sharedJs/general";
import { PickupDeliverySchedulingOptionsHelpers } from "../../bag/select-delivery-options-screen/pickup-delivery-scheduling-options/helpers";
import { SocialProfilesHelpers } from "../../dash-shared/socialProfiles";
import { ProfileHelpers } from "../profile-helpers";

export interface ProfileEditFormValues {
	photos: string[];
	email: string;
	phone: string;
	city: ICitySearchModel;
	gender: number | string;
	birthDate: Date;
	oldPssword: string;
	newPssword: string;
	fullName: string;
	displayName: string;
	userName: string;
	lat: string | number;
	lng: string | number;
	status: string | number;
	percent: string | number;
	whoWillManageFulfillment: string | number;
	deliveryFee: string | number;
	deliveryDays: DayOfWeekUI[];
	deliveryTimes: TimeRangeValue[];
	pickupFee: string | number;
	pickupDays: DayOfWeekUI[];
	pickupTimes: TimeRangeValue[];
	deliveryOptions: (DeliveryType | DeliveryTypeUI)[];
	facebookLink: string;
	instagramLink: string;
	twitterLink: string;
	grantWholesaleAccess: string | number;
	canReceiveGifts: string | number;
	orderLeadTimeDays: string | number;
	orderCutOffTime: Date;
	businessLocation: { longitude: number; latitude: number };
	profileDescription: string;
	phyudAddress: string;
	recoveryPhrase: string;
	canCashOut?: string | number;
	kycVerified?: string | number;
}

export function getInitialFormGroup(
	profile: IUserProfileResponse,
	disposed: Observable<any>
): IFormGroup<ProfileEditFormValues> {
	const initialDeliveryOptionIds = profile.deliveryOptions;

	const initialBirthDate = (() => {
		let date = profile.birthDate;
		if (typeof date === "string") {
			date = dayjs(date).toDate();
		}
		return fix_Dec31_0515_ApiDateIssue(date);
	})();

	const links = SocialProfilesHelpers.getLinksFromProfiles(
		profile.socialProfiles ?? []
	);

	const defaultBusinessLocation: {
		longitude: number | null;
		latitude: number | null;
	} = (() => {
		return profile.businessLat === 0 && profile.businessLng === 0
			? { longitude: null, latitude: null }
			: { longitude: profile.businessLng, latitude: profile.businessLat };
	})();

	const form = TFormBuilder().group<ProfileEditFormValues>({
		photos: [profile?.photos ?? []],
		email: [
			profile.email.includes("guest") ? "" : profile.email,
			[Validators.required, Validators.email],
		],
		phone: [profile.phone, [Validators.required]],
		city: [
			{
				id: profile.cityId,
				cityName: profile.city,
			},
			[Validators.required, CustomValidators.ValidateItemFromObjectList],
		],
		gender: [profile.gender, [Validators.required]],
		birthDate: [initialBirthDate],
		oldPssword: ["", [Validators.minLength(4), Validators.maxLength(50)]],
		newPssword: ["", [Validators.minLength(4), Validators.maxLength(50)]],
		fullName: [
			profile.fullName,
			[Validators.required, Validators.maxLength(150)],
		],
		displayName: [profile.displayName, [Validators.maxLength(150)]],
		userName: [
			profile.userName.toLowerCase(),
			[Validators.required, CustomValidators.CustomUsernameValidator],
		],
		phyudAddress: [profile.phyudAddress, [CustomValidators.phyudAddress]],
		recoveryPhrase: profile.recoveryPhrase,
		lat: [profile.lat],
		lng: [profile.lng],
		status: [profile.status],
		percent: [
			profile.isSuperUser ? profile.percent : null,
			[CustomValidators.MustBeNumber({ allowDecimal: false })],
		],
		whoWillManageFulfillment: [profile.whoWillManageFulfillment, []],
		deliveryFee: [
			profile.deliveryFee,
			[CustomValidators.MustBeNumber({ allowDecimal: true })],
		],
		deliveryDays: [
			ProfileHelpers.parsePickupDeliveryDays(profile.deliveryDays),
			[],
		],
		deliveryTimes: [
			ProfileHelpers.parsePickupDeliveryTimes(profile.deliveryTimeSlots),
			[],
		],
		pickupFee: [
			profile.pickupFee,
			[CustomValidators.MustBeNumber({ allowDecimal: true })],
		],
		pickupDays: [
			ProfileHelpers.parsePickupDeliveryDays(profile.pickupDays),
			[],
		],
		pickupTimes: [
			ProfileHelpers.parsePickupDeliveryTimes(profile.pickupTimeSlots),
			[],
		],
		deliveryOptions: [
			initialDeliveryOptionIds,
			[CustomValidators.NonEmptyArrayValidator],
		],
		facebookLink: [links.facebook, [CustomValidators.URL]],
		instagramLink: [links.instagram, [CustomValidators.URL]],
		twitterLink: [links.twitter, [CustomValidators.URL]],
		grantWholesaleAccess: [profile.grantWholesaleAccess ? 1 : 0],
		canReceiveGifts: [profile.canReceiveGifts ? 1 : 0],
		orderLeadTimeDays: [
			profile.orderLeadTimeInDays ??
				PickupDeliverySchedulingOptionsHelpers.DEFAULT_ORDER_LEAD_TIME_DAYS,
			[
				Validators.required,
				CustomValidators.MustBeNumber({
					allowNegative: false,
					allowDecimal: false,
				}),
			],
		],
		orderCutOffTime: [
			profile.orderCutOffTime ??
				PickupDeliverySchedulingOptionsHelpers.DEFAULT_PICKUP_DELIVERY_CUT_OFF_TIME,
			[Validators.required],
		],
		businessLocation: TFormBuilder().group<
			ProfileEditFormValues["businessLocation"]
		>({
			longitude: [
				defaultBusinessLocation.longitude,
				[
					CustomValidators.MustBeNumber({
						allowNegative: true,
						allowDecimal: true,
					}),
				],
			],
			latitude: [
				defaultBusinessLocation.latitude,
				[
					CustomValidators.MustBeNumber({
						allowNegative: true,
						allowDecimal: true,
					}),
				],
			],
		}),
		profileDescription: TFormControl(profile.description, [
			Validators.maxLength(700),
		]), // database has a limit of 150 characters so we place this limit here as well
		canCashOut: [profile.canCashOut ? 1 : 0],
		kycVerified: [profile.kycVerified ? 1 : 0],
	});

	form.addEnabledFieldsListener((value) => {
		const userWillManageFulfillment =
			parseInt(<any>value.whoWillManageFulfillment) ===
			WhoWillManageFulfillmentUI.MyBusiness;

		const userAllowsDeliveries = !!(<DeliveryTypeUI[]>(
			value.deliveryOptions
		))?.includes(DeliveryTypeUI.Delivery);

		const userAllowsPickUps = !!(<DeliveryTypeUI[]>(
			value.deliveryOptions
		))?.includes(DeliveryTypeUI.Pickup);

		return [
			...(["deliveryFee", "deliveryDays", "deliveryTimes"] as const).map(
				(x) => ({
					controlName: x,
					enabled: userWillManageFulfillment && userAllowsDeliveries,
				})
			),
			...(["pickupFee", "pickupDays", "pickupTimes"] as const).map(
				(x) => ({
					controlName: x,
					enabled: userWillManageFulfillment && userAllowsPickUps,
				})
			),
			{
				controlName: "deliveryOptions",
				enabled: userWillManageFulfillment,
			},
		];
	}, disposed);

	return form;
}
