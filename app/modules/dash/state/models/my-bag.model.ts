import { IProductViewModel } from "../../../../core/api/api-client.service";

export interface MyBagEntry {
	readonly product: IProductViewModel;
	readonly quantity: number;
	readonly eventInfo?: {
		id?: string | undefined | null;
		name: string;
		// using a date string instead of a date because bag items are persisted in localStorage which will return the dates as a string. So this will prevent bugs
		dateISOString?: string | undefined | null;
	} | null;
	// this represents the date the user added this entry to the bag
	readonly dateAddedToBagISOString: string;

	// represents the market city that was set when this product was added to the cart
	readonly marketCityId: string | null;
	readonly marketCityCountry: string | null;
}

export interface MyBagStateModel {
	readonly comments: {
		// there is supposed to be one comment per order (per event, per vendor), so the id for the comment is composed using the eventId (or nothing if direct) + vendorId
		readonly [eventId_vendorId: string]: string;
	};
	readonly bagEntries: {
		readonly [productId: string]: MyBagEntry;
	};
}
