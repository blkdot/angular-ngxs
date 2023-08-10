import { Injectable } from "@angular/core";
import {
	Action,
	createSelector,
	NgxsOnInit,
	Selector,
	State,
	StateContext,
	Store,
} from "@ngxs/store";
import * as dayjs from "dayjs";
import produce from "immer";
import { from } from "rxjs";
import {
	distinctUntilChanged,
	filter,
	map,
	switchMap,
	tap,
} from "rxjs/operators";
import { AlertSuccess } from "src/app/core/state/alert/alert.actions";
import { UIState } from "src/app/core/state/ui/ui.state";
import {
	caseInsensitiveStringSort,
	deepEquals,
	mapOptional,
} from "src/app/sharedJs/general";
import {
	ApiClient,
	BagEventVendor,
	IProductViewModel,
	UpdateBagRequest,
} from "../../../../core/api/api-client.service";
import { Logout } from "../../../../core/state/auth/auth.actions";
import { LocalizationState } from "../../../../core/state/localization/localization.state";
import { ProductHelpers } from "../../products/helpers/helpers";
import { MyBagActions } from "../actions/my-bag.actions";
import { MyBagEntry, MyBagStateModel } from "../models/my-bag.model";

export type SortedBagEntryIds = {
	eventInfo?: MyBagEntry["eventInfo"] | null;
	vendors: {
		vendorId: string;
		vendorName: string;
		productIds: string[];
	}[];
}[];

export interface BagOrderInfoItem {
	readonly eventId: string | null;
	readonly eventDate: Date | null;
	readonly vendorId: string | null;
	readonly comment: string | null;
	readonly productsTotalPrice: number;
	readonly items: readonly {
		product: IProductViewModel;
		quantity: number;
	}[];
}

@State<MyBagStateModel>({
	name: "myBag",
	defaults: {
		bagEntries: {},
		comments: {},
	},
})
@Injectable()
export class MyBagState implements NgxsOnInit {
	constructor(private api: ApiClient, private store: Store) {}

	ngxsOnInit(ctx: StateContext<MyBagStateModel>) {
		// refreshes my bag state every time the user loads the app, only if the user is logged in
		from(import("../../../../core/state/auth/auth.state"))
			.pipe(
				switchMap((M) => this.store.select(M.AuthState.token)),
				filter((x) => typeof x === "string" && x.trim().length >= 1)
			)
			.subscribe(() => {
				ctx.dispatch(new MyBagActions.RefreshProducts());
			});

		// empties the bag whenever the city id changes
		from(import("../../../../core/state/ui/ui.state"))
			.pipe(
				switchMap((M) => this.store.select(M.UIState.marketCity)),
				map((x) => x?.country),
				filter((x) => typeof x === "string" && x.length > 1),
				distinctUntilChanged()
			)
			.subscribe((marketCountryName) => {
				// when updating state directly based on another state, we need to do it in the next run loop tick, otherwise ngxs sends outdated state values in selectors
				setTimeout(() => {
					// removes any entries from the bag where the current market city is not equal to market city of the bag entry
					ctx.setState(
						produce(ctx.getState(), (draft) => {
							for (const productId in draft.bagEntries) {
								const entry = draft.bagEntries[productId];
								if (entry.marketCityCountry !== marketCountryName) {
									delete draft.bagEntries[productId];
								}
							}
						})
					);
				}, 0);
			});
	}

	@Selector()
	static bagEntries(state: MyBagStateModel) {
		return state.bagEntries;
	}

	@Selector()
	static bagTotal(state: MyBagStateModel): number {
		return Object.values(state.bagEntries).reduce((accumulated, newValue) => {
			return (
				accumulated +
				ProductHelpers.getProductPrice(newValue.product) * newValue.quantity
			);
		}, 0);
	}

	@Selector()
	static numberOfBagItems(state: MyBagStateModel): number {
		let count = 0;
		for (const _ in state.bagEntries) {
			count++;
		}
		return count;
	}

	@Selector()
	static numberOfBagVendors(state: MyBagStateModel): number {
		const vendorIds = new Set<string>();
		for (const productId in state.bagEntries) {
			const vendorId = state.bagEntries[productId]?.product.userId;
			if (typeof vendorId === "string") vendorIds.add(vendorId);
		}
		return vendorIds.size;
	}

	/// returns the number of orders that would be created if the current bag items were checked out
	@Selector()
	static numberOfResultingOrders(state: MyBagStateModel): number {
		const vendorEventCombinations = new Set<string>();
		for (const productId in state.bagEntries) {
			const entry = state.bagEntries[productId];
			const vendorId = entry?.product.userId;
			if (typeof vendorId === "string")
				vendorEventCombinations.add(vendorId + (entry?.eventInfo?.id ?? ""));
		}
		return vendorEventCombinations.size;
	}

	static bagEntry(
		productId: string
	): (state: MyBagStateModel) => MyBagEntry | null {
		return createSelector([MyBagState], (state) => {
			return state.bagEntries[productId] ?? null;
		});
	}

	static comment({
		eventId,
		vendorId,
	}: {
		eventId: string | null;
		vendorId: string;
	}): (state: MyBagStateModel) => string | null {
		return createSelector([MyBagState], (state) => {
			return (
				state.comments[this.composeCommentId({ eventId, vendorId })] ?? null
			);
		});
	}

	@Selector()
	static getSortedBagItemsByEvent(state: MyBagStateModel): SortedBagEntryIds {
		const sortedEntries = Object.values(state.bagEntries).sort(
			caseInsensitiveStringSort((x) => x.product.typeName)
		);

		const entriesByEvents = [
			...sortedEntries.groupBy((x) => x.eventInfo?.id ?? null).values(),
		].sort((i1, i2) => {
			const i1Name = i1[0].eventInfo?.name.toLowerCase() ?? null;
			const i2Name = i2[0].eventInfo?.name.toLowerCase() ?? null;
			if (i1Name == null) return 1;
			else if (i2Name == null) return -1;
			else return i1Name.localeCompare(i2Name);
		});

		return entriesByEvents.map((entries) => ({
			eventInfo: entries[0].eventInfo,
			vendors: [...entries.groupBy((x) => x.product.userName).values()]
				.map((vendorEntries) => ({
					vendorId: vendorEntries[0].product.userId,
					vendorName: vendorEntries[0].product.userName,
					productIds: vendorEntries.map((x) => x.product.id),
				}))
				.sort(caseInsensitiveStringSort((x) => x.vendorName)),
		}));
	}

	@Selector()
	static splitEntriesIntoOrders(state: MyBagStateModel): BagOrderInfoItem[] {
		return [
			...Object.values(state.bagEntries)
				.groupBy((x) => x.eventInfo?.id ?? null)
				.values(),
		]
			.flatMap((x) => [...x.groupBy((y) => y.product.userId).values()])
			.map((x) => {
				const eventId = x[0].eventInfo?.id ?? null;
				const eventDate =
					mapOptional(x[0].eventInfo?.dateISOString, (x) => new Date(x)) ??
					null;
				const vendorId = x[0].product.userId;
				const commentId = this.composeCommentId({ eventId, vendorId });
				const items = x.map((x) => ({
					product: x.product,
					quantity: x.quantity,
				}));
				const productsTotalPrice = items.reduce(
					(acc, newItem) =>
						acc +
						newItem.quantity * ProductHelpers.getProductPrice(newItem.product),
					0
				);
				return Object.freeze({
					eventId,
					vendorId,
					eventDate,
					comment: state.comments?.[commentId] ?? null,
					items,
					productsTotalPrice,
				});
			});
	}

	@Selector()
	static mostRecentBagEntry(state: MyBagStateModel): MyBagEntry | null {
		let result: MyBagEntry | null = null;
		const bagEntries = state.bagEntries;

		for (const entryId in bagEntries) {
			const entry = bagEntries[entryId];
			if (
				result == null ||
				(entry.dateAddedToBagISOString != null &&
					(result.dateAddedToBagISOString == null ||
						dayjs(entry.dateAddedToBagISOString).isAfter(
							dayjs(result.dateAddedToBagISOString)
						)))
			) {
				result = entry;
			}
		}
		return result;
	}

	@Action(MyBagActions.RefreshProducts)
	refreshProductsInBag(ctx: StateContext<MyBagStateModel>) {
		const oldBagEntries = ctx.getState().bagEntries;
		const updateObjs = [
			...Object.values(oldBagEntries).groupBy((x) => x.eventInfo?.id ?? null),
		].map(
			([eventId, entriesForEvent]) =>
				new UpdateBagRequest({
					eventId: eventId,
					vendors: [...entriesForEvent.groupBy((y) => y.product?.userId)].map(
						([vendorId, entriesForVendor]) =>
							new BagEventVendor({
								vendorId: vendorId,
								productIds: entriesForVendor.map((x) => x.product.id),
							})
					),
				})
		);

		return this.api
			.updateBag(new Date(new Date().toDateString()), updateObjs)
			.pipe(
				tap((result) => {
					const currentBagEntries = ctx.getState().bagEntries;
					// if the old bag entries aren't equal to the current bag entries, that means the bag entries were changed before the api request was completed. In this case, we don't want to update the bag entries state at this point, because the information would be outdated.
					if (deepEquals(oldBagEntries, currentBagEntries) === false) {
						return;
					}
					const newEntries: { [index: string]: MyBagEntry } = {};

					for (const { event, vendors } of result.events) {
						for (const { products } of vendors) {
							for (const product of products) {
								const oldEntry = currentBagEntries[product.id];
								if (oldEntry == null) continue;
								newEntries[product.id] = {
									dateAddedToBagISOString: oldEntry.dateAddedToBagISOString,
									quantity: oldEntry.quantity,
									eventInfo:
										mapOptional(event, (x) => ({
											id: x.id,
											name: event.name,
											dateISOString: x.date?.toISOString(),
										})) ?? null,
									product,
									marketCityId: oldEntry.marketCityId,
									marketCityCountry: oldEntry.marketCityCountry,
								};
							}
						}
					}
					ctx.patchState({ bagEntries: newEntries });
				})
			);
	}

	@Action(MyBagActions.AddItemToBag)
	addItemToBag(
		ctx: StateContext<MyBagStateModel>,
		{ payload }: MyBagActions.AddItemToBag
	) {
		const isAvailable = ProductHelpers.validateRequestedQuantityIsAvailable({
			productInfo: payload.bagEntry.product,
			amountRequested: payload.bagEntry.quantity,
			store: this.store,
		});
		if (isAvailable === false) return;
		const localization = this.store.selectSnapshot(
			LocalizationState.localization
		);
		if (localization?.currencyCode !== payload.bagEntry.product.currencyCode) {
			setTimeout(() => {
				this.store.dispatch(
					new AlertSuccess(
						"Sorry, you can't order a product that has a currency code different from your current market city currency code."
					)
				);
			}, 0);
			return;
		}

		ctx.setState(
			produce(ctx.getState(), (draftState) => {
				const marketCity = this.store.selectSnapshot(UIState.marketCity);
				draftState.bagEntries[payload.bagEntry.product.id] = {
					...payload.bagEntry,
					dateAddedToBagISOString: new Date().toISOString(),
					marketCityId: marketCity?.id ?? null,
					marketCityCountry: marketCity?.country ?? null,
				};
			})
		);
	}

	@Action(MyBagActions.RemoveItemFromBag)
	removeItemFromBag(
		ctx: StateContext<MyBagStateModel>,
		{ payload: { productId } }: MyBagActions.RemoveItemFromBag
	) {
		ctx.setState(
			produce(ctx.getState(), (draftState) => {
				delete draftState.bagEntries[productId];
			})
		);
	}

	@Action(MyBagActions.UpdateBagEntryQuantity)
	updateBagEntryQuantity(
		ctx: StateContext<MyBagStateModel>,
		{ payload: { productId, newQuantity } }: MyBagActions.UpdateBagEntryQuantity
	) {
		const bagEntry = ctx.getState().bagEntries[productId];
		if (bagEntry == null) return;

		ProductHelpers.validateRequestedQuantityIsAvailable({
			productInfo: bagEntry.product,
			amountRequested: newQuantity,
			store: this.store,
		});

		const adjustedQuantityAvailable =
			ProductHelpers.getAdjustedNumberOfAvailableProducts(bagEntry.product);

		if (adjustedQuantityAvailable >= 1) {
			ctx.setState(
				produce(ctx.getState(), (draftState) => {
					const entry = draftState.bagEntries[productId];
					if (entry == null) return;
					entry.quantity = Math.min(
						Math.max(1, newQuantity),
						adjustedQuantityAvailable
					);
				})
			);
		} else {
			ctx.dispatch(new MyBagActions.RemoveItemFromBag({ productId }));
		}
	}

	private static composeCommentId({
		eventId,
		vendorId,
	}: {
		eventId: string | null;
		vendorId: string;
	}) {
		return (eventId ?? "") + vendorId;
	}

	@Action(MyBagActions.AddComment)
	addBagComment(
		ctx: StateContext<MyBagStateModel>,
		{ payload: { eventId, vendorId, commentText } }: MyBagActions.AddComment
	) {
		commentText = commentText?.trim();
		ctx.setState(
			produce(ctx.getState(), (draftState) => {
				const commentId = MyBagState.composeCommentId({ eventId, vendorId });
				if ((commentText?.length ?? 0) <= 0)
					delete draftState.comments?.[commentId];
				else draftState.comments = draftState.comments ?? {};
				draftState.comments[commentId] = commentText;
			})
		);
	}

	@Action(MyBagActions.EmptyBag)
	emptyBag(ctx: StateContext<MyBagStateModel>) {
		ctx.setState({ bagEntries: {}, comments: {} });
	}
	@Action(Logout)
	userDidLogOut(ctx: StateContext<MyBagStateModel>) {
		ctx.setState({ bagEntries: {}, comments: {} });
	}
}
