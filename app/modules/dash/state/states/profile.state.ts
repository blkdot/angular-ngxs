import { Injectable } from "@angular/core";
import {
	Action,
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	Store,
} from "@ngxs/store";
import produce from "immer";
import { from } from "rxjs";
import {
	distinctUntilChanged,
	filter,
	first,
	map,
	switchMap,
	tap,
} from "rxjs/operators";
import { ProductOrderTypeUI } from "src/app/core/api/ApiEnums";
import { Logout } from "src/app/core/state/auth/auth.actions";
import {
	combineLatestObj,
	mergeIntoObject,
} from "src/app/sharedJs/observableStuff";
import {
	ApiClient,
	IUserProfileResponse,
	ProductSearchRequest,
} from "../../../../core/api/api-client.service";
import { EMPTY_UUID } from "../../../../sharedJs/general";
import { RefreshProfileState } from "../actions/profile.actions";
import { IProfileStateModel } from "../models/profile.models";

const defaultProfileStateModel: IProfileStateModel = {
	currentUserProfile: null,
	hasActiveWholesaleProducts: false,
};

@State<IProfileStateModel>({
	name: "profile",
	defaults: defaultProfileStateModel,
})
@Injectable()
export class ProfileState implements NgxsOnInit {
	@Selector()
	static currentUserProfile(
		state: IProfileStateModel
	): IUserProfileResponse | null {
		return state.currentUserProfile;
	}

	@Selector()
	static canViewWholesaleScreen(state: IProfileStateModel): boolean {
		return (
			state?.currentUserProfile?.isSuperUser ||
			state?.currentUserProfile?.grantWholesaleAccess ||
			state.hasActiveWholesaleProducts
		);
	}

	constructor(private api: ApiClient, private store: Store) {}

	ngxsOnInit(ctx: StateContext<IProfileStateModel>) {
		// refreshes current user profile whenever user logs in
		from(import("../../../../core/state/auth/auth.state"))
			.pipe(
				switchMap((M) => this.store.select(M.AuthState.token)),
				filter((x) => typeof x === "string" && x.trim().length >= 1),
				distinctUntilChanged()
			)
			.subscribe(() => {
				ctx.dispatch(new RefreshProfileState());
			});
	}

	@Action(RefreshProfileState)
	refreshCurrentUserProfile(ctx: StateContext<IProfileStateModel>) {
		return combineLatestObj({
			profile: this.api.getProfile(null, EMPTY_UUID),
		}).pipe(
			mergeIntoObject(({ profile }) => ({
				hasActiveWholesaleProducts: this.api
					.searchProducts(
						new ProductSearchRequest({
							categoryIds: [],
							typeId: null,
							priceMax: null,
							priceMin: null,
							properties: null,
							orderType: <any>ProductOrderTypeUI.Amount,
							orderDesc: false,
							cityId: null,
							searchText: "",
							page: 1,
							pageSize: 1,
							eventId: null,
							userId: profile.id,
							hasWholeSaleAccess: true,
						})
					)
					.pipe(map((x) => (x?.length ?? 0) >= 1)),
			})),
			first(),
			tap(({ profile, hasActiveWholesaleProducts }) => {
				ctx.setState(
					produce(ctx.getState(), (draft) => {
						draft.currentUserProfile = profile;
						draft.hasActiveWholesaleProducts = hasActiveWholesaleProducts;
					})
				);
			})
		);
	}

	@Action(Logout)
	respondToLogOut(ctx: StateContext<IProfileStateModel>) {
		ctx.setState(defaultProfileStateModel);
	}
}
