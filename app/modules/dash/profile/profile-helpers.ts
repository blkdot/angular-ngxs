import dayjs from "dayjs";
import { Observable, of } from "rxjs";
import { first, map } from "rxjs/operators";
import {
	ApiClient,
	IUserProfileResponse,
	ProductSearchRequest,
	ProductsSearchQueryResult,
} from "src/app/core/api/api-client.service";
import { DayOfWeekUI } from "src/app/core/api/ApiEnums";
import { isObject } from "src/app/sharedJs/general";
import {
	combineLatestObj,
	mergeIntoObject,
} from "src/app/sharedJs/observableStuff";
import { TimeRangeValue } from "../../shared/input-fields/data-specific-inputs/time-input/time-input.component";

export namespace ProfileHelpers {
	export function getPublicNameForUser(
		userInfo: Pick<IUserProfileResponse, "displayName" | "fullName">
	) {
		return userInfo.displayName ?? userInfo.fullName;
	}

	export enum ProductType {
		active,
		deleted,
		pending,
		soldOut,
	}

	function _getProductsForUser({
		userId,
		productTypes,
		api,
		showExpiredDeals,
	}: {
		api: ApiClient;
		userId: string;
		productTypes: Set<ProductType>;
		showExpiredDeals?: boolean;
	}) {
		const activeProductsRequest = Object.freeze(
			new ProductSearchRequest({
				categoryIds: null,
				page: 1,
				pageSize: 100,
				priceMax: null,
				priceMin: null,
				properties: 0,
				typeId: null,
				orderDesc: true,
				orderType: 0,
				userId: userId,
				cityId: null,
				showDeleted: false,
				showPending: false,
				showSoldOut: false,
				showExpiredDeals,
			})
		);
		const deletedProductsRequest = new ProductSearchRequest({
			...activeProductsRequest,
			showDeleted: true,
		});
		const pendingProductsRequest = new ProductSearchRequest({
			...activeProductsRequest,
			showPending: true,
		});
		const soldOutProductsRequest = new ProductSearchRequest({
			...activeProductsRequest,
			showSoldOut: true,
		});

		const activeProducts = api.searchProducts(activeProductsRequest);

		function getInactiveProducts(activeProducts: ProductsSearchQueryResult[]) {
			const removeActiveProductsFrom = (() => {
				const activeProductIds = new Set(activeProducts.map((x) => x.id));
				return (products: Observable<ProductsSearchQueryResult[]>) => {
					return products.pipe(
						map((x) => x.filter((y) => activeProductIds.has(y.id) === false))
					);
				};
			})();

			return {
				deleted: removeActiveProductsFrom(
					api.searchProducts(deletedProductsRequest)
				),
				soldOut: removeActiveProductsFrom(
					api.searchProducts(soldOutProductsRequest)
				),
				pending: api.searchProducts(pendingProductsRequest),
			};
		}

		return combineLatestObj({
			active: activeProducts,
		}).pipe(
			mergeIntoObject((values) => {
				const inactiveProducts = getInactiveProducts(values.active);
				const emptyArray = of<ProductsSearchQueryResult[]>([]);
				return {
					deleted: productTypes.has(ProductType.deleted)
						? inactiveProducts.deleted
						: emptyArray,
					pending: productTypes.has(ProductType.pending)
						? inactiveProducts.pending
						: emptyArray,
					soldOut: productTypes.has(ProductType.soldOut)
						? inactiveProducts.soldOut
						: emptyArray,
				};
			}),
			first()
		);
	}

	export function getProductSectionsForUser({
		currentUser,
		userBeingDisplayed,
		api,
	}: {
		currentUser: IUserProfileResponse;
		userBeingDisplayed: IUserProfileResponse;
		api: ApiClient;
	}) {
		const isSuperUser = currentUser?.isSuperUser === true;
		const isCurrentUser =
			userBeingDisplayed?.id != null &&
			userBeingDisplayed?.id === currentUser?.id;

		const productTypes = new Set(
			(() => {
				if (isSuperUser)
					return [
						ProductType.active,
						ProductType.deleted,
						ProductType.pending,
						ProductType.soldOut,
					];
				else if (isCurrentUser)
					return [ProductType.active, ProductType.pending, ProductType.soldOut];
				else return [ProductType.active];
			})()
		);

		return _getProductsForUser({
			userId: userBeingDisplayed.id,
			api,
			productTypes,
			showExpiredDeals: isCurrentUser || isSuperUser,
		}).pipe(
			map((x) => {
				const productSections: {
					type: ProductType;
					title: string;
					products: ProductsSearchQueryResult[];
					allHref?: string;
					allQueryParams?: Record<string, string>;
				}[] = [
					{
						title: "Products",
						products: x.active,
						allHref: "/app/profile/shop-products/" + userBeingDisplayed.id,
						type: ProductType.active,
					},
					{
						title: "Pending products",
						products: x.pending,
						type: ProductType.pending,
					},
					{
						title: "Sold out products",
						products: x.soldOut,
						type: ProductType.soldOut,
					},
					{
						title: "Deleted products",
						products: x.deleted,
						type: ProductType.deleted,
					},
				];
				return productSections;
			}),
			map((x) => x.filter((x) => x.products.length >= 1))
		);
	}

	export function getAvailableDeliveryTimesOptionsForVendor(): TimeRangeValue[] {
		const d = dayjs().startOf("day");
		return [
			{
				startTime: d.set("hour", 10).toDate(), // 10am
				endTime: d.set("hour", 12 + 1).toDate(), // 1pm
			},
			{
				startTime: d.set("hour", 12 + 1).toDate(), // 1pm
				endTime: d.set("hour", 12 + 4).toDate(), // 4pm
			},
			{
				startTime: d.set("hour", 12 + 4).toDate(), // 4am
				endTime: d.set("hour", 12 + 7).toDate(), // 7pm
			},
		];
	}

	export function parseSinglePickupDeliveryTimeSlot(
		jsonString: string
	): TimeRangeValue | null {
		try {
			const parsedJson = JSON.parse(jsonString);
			return _getSinglePickupDeliveryTimeSlot(parsedJson);
		} catch {
			return null;
		}
	}

	export function parsePickupDeliveryTimes(
		jsonString: string
	): TimeRangeValue[] {
		try {
			const parsed: any[] = JSON.parse(jsonString);
			if (Array.isArray(parsed) === false) throw new Error();
			return parsed.compactMap((x) => {
				return _getSinglePickupDeliveryTimeSlot(x);
			});
		} catch {}
		return [];
	}

	function _getSinglePickupDeliveryTimeSlot(
		timeSlotObj: any
	): TimeRangeValue | null {
		if (!isObject(timeSlotObj)) return null;
		const startTimeString = timeSlotObj.StartTime ?? timeSlotObj.startTime;
		const endTimeString = (() => {
			const y = timeSlotObj.EndTime ?? timeSlotObj.endTime;
			// if the end time string is the below string, this means the value is most likely empty, as previously, the pickup end time was left null and only the startTime was set. Because of this the end times were set to this 'zero' value. The proper value would be an hour after the start time in this case
			if (y === "0001-01-01T00:00:00+00:00") return null;
			else return y;
		})();
		if (isObject(timeSlotObj) && !isNaN(Date.parse(startTimeString)))
			return {
				startTime: new Date(startTimeString),
				endTime: !isNaN(Date.parse(endTimeString))
					? new Date(endTimeString)
					: dayjs(startTimeString).add(1, "hour").toDate(),
			};
		else return null;
	}

	export function parsePickupDeliveryDays(jsonString: string): DayOfWeekUI[] {
		try {
			const parsed = JSON.parse(jsonString);
			if (Array.isArray(parsed) === false) throw new Error();
			return parsed.compactMap((x) => (typeof x === "number" ? x : null));
		} catch {}
		return [];
	}
}
