import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngxs/store";
import {
	distinctUntilChanged,
	filter,
	first,
	pluck,
	switchMap,
	tap,
} from "rxjs/operators";
import { shallowEqualObjects } from "shallow-equal";
import { PageMetaHelperService } from "src/app/modules/shared/service/page-meta-helper.service";
import { AppSVGIconsService } from "src/app/modules/shared/service/svg/app-svgicons.service";
import { EMPTY_UUID, getNumberArray } from "src/app/sharedJs/general";
import {
	combineLatestObj,
	mergeIntoObject,
	shareReplayLastUntil,
} from "src/app/sharedJs/observableStuff";
import {
	ApiClient,
	IUserProfileResponse,
} from "../../../../core/api/api-client.service";
import { ComponentUtils } from "../../../../core/domain/ComponentUtils";
import { ProfileState } from "../../state/states/profile.state";
import { ProfileHelpers } from "../profile-helpers";

@Component({
	selector: "app-profile-public-details",
	templateUrl: "./profile-public-details.component.html",
	styleUrls: ["./profile-public-details.component.scss"],
})
export class ProfilePublicDetailsComponent
	extends ComponentUtils
	implements OnInit
{
	private readonly profile$ = this.route.params.pipe(
		filter((params) => !!params),
		pluck("username"),
		distinctUntilChanged(),
		switchMap((username) =>
			this.loadTask(() => this.api.getByUserName(username, EMPTY_UUID))
		),
		tap({
			error: () => {
				this.router.navigate(["app/home"], { replaceUrl: true });
			},
		}),
		shareReplayLastUntil(this.disposed$)
	);

	readonly templateAsyncValues$ = combineLatestObj({
		profile: this.profile$,
		currentUser: this.store
			.select(ProfileState.currentUserProfile)
			.pipe(distinctUntilChanged(shallowEqualObjects)),
	}).pipe(
		mergeIntoObject((values) => {
			const isSuperUser = values.currentUser?.isSuperUser === true;

			return {
				isSuperUser,
				profileDescription: (() => {
					let x = values.profile.description;
					if (typeof x !== "string" || (x = x.trim()).length < 1) return null;
					return x;
				})(),
				profileShareUrl:
					window.location.protocol +
					"//" +
					window.location.host +
					"/" +
					values.profile.userName,
				eventsIParticipateIn: this.loadTask(() =>
					this.api.getUserEvents(
						values.profile.id,
						new Date(new Date().toDateString())
					)
				),
				eventsIHost: this.loadTask(() =>
					this.api.getHostedEventList(
						values.profile.id,
						new Date(new Date().toDateString())
					)
				),
				productSections: this.loadTask(() =>
					ProfileHelpers.getProductSectionsForUser({
						currentUser: values.currentUser,
						userBeingDisplayed: values.profile,
						api: this.api,
					})
				),
				canEdit: isSuperUser || values.currentUser?.id === values.profile.id,
			};
		}),
		mergeIntoObject((v) => ({
			showShopMyProductsButton:
				(v.productSections.find(
					(x) => x.type === ProfileHelpers.ProductType.active
				)?.products.length ?? 0) >= 1,
		})),
		shareReplayLastUntil(this.disposed$)
	);

	constructor(
		private api: ApiClient,
		private route: ActivatedRoute,
		public location: Location,
		readonly svg: AppSVGIconsService,
		readonly router: Router,
		readonly store: Store,
		readonly metaInfo: PageMetaHelperService
	) {
		super();
	}

	ngOnInit(): void {
		this.profile$.pipe(first()).subscribe((profile) => {
			this.metaInfo.setForCurrentRoute({
				title:
					ProfileHelpers.getPublicNameForUser(profile) + " - Swapacrop.com",
			});
		});
	}

	private miniReviewStar = {
		filled: this.svg.icons.miniReviewStar(1),
		unfilled: this.svg.icons.miniReviewStar(0),
	};

	backButtonClicked() {
		this.router.navigate(["app/home"]);
	}

	getStarSvgIcons(profile: IUserProfileResponse): any[] {
		const numberOfStars = profile.rating; // this value is supposed to be obtained from the profile
		const returnVal = getNumberArray(0, 4).map((x) => {
			return Math.round(numberOfStars) >= x + 1
				? this.miniReviewStar.filled
				: this.miniReviewStar.unfilled;
		});
		return returnVal;
	}
}
