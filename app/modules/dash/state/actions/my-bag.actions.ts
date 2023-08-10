import { MyBagEntry } from "../models/my-bag.model";

export namespace MyBagActions {
	export class AddComment {
		static readonly type = "[My Bag] AddOrderComment";
		constructor(
			readonly payload: {
				eventId: string | null;
				vendorId: string;
				commentText: string | null;
			}
		) {}
	}

	export class AddItemToBag {
		static readonly type = "[My Bag] AddItemToBag";
		constructor(
			readonly payload: {
				bagEntry: Pick<MyBagEntry, "product" | "quantity" | "eventInfo">;
			}
		) {}
	}

	export class RemoveItemFromBag {
		static readonly type = "[My Bag] RemoveItemFromBag";
		constructor(readonly payload: { productId: string }) {}
	}

	export class UpdateBagEntryQuantity {
		static readonly type = "[My Bag] UpdateBagEntryQuantity";
		constructor(readonly payload: { productId: string; newQuantity: number }) {}
	}

	export class RefreshProducts {
		static readonly type = "[My Bag] RefreshProducts";
	}

	export class EmptyBag {
		static readonly type = "[My Bag] EmptyBag";
	}
}
