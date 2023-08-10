import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { shareReplayLast } from "src/app/sharedJs/observableStuff";

export type CurrencyConverterFn = (
	amount: number,
	currencyCode: string
) => number | null;

@Injectable({ providedIn: "root" })
export class CurrencyConverterService {
	constructor(readonly apiClient: HttpClient) {}

	private readonly currencyRates$ = this.apiClient
		.get(
			"https://openexchangerates.org/api/latest.json?app_id=665f01bd17924d0ca8f8a51aace43e9e"
		)
		.pipe(shareReplayLast());

	getConverterToUSD(): Observable<CurrencyConverterFn> {
		return this.currencyRates$.pipe(
			map((response: { rates: Record<string, number> }) => {
				return function (amount: number, currencyCode: string): number | null {
					const rate = response.rates[currencyCode];
					if (rate == null) return null;
					return amount / rate;
				};
			})
		);
	}

	convertToUSD(
		amount: number,
		currencyCode: string
	): Observable<number | null> {
		return this.getConverterToUSD().pipe(map((x) => x(amount, currencyCode)));
	}

	getConverterToPHY(): Observable<CurrencyConverterFn> {
		return this.getConverterToUSD().pipe(
			map((x) => {
				return function (amount: number, currencyCode: string) {
					return x(amount, currencyCode) * 100;
				};
			})
		);
	}

	convertToPHY(amount: number, currencyCode: string) {
		return this.getConverterToPHY().pipe(map((x) => x(amount, currencyCode)));
	}

	getConverterToLocalCurrenct(): Observable<CurrencyConverterFn> {
		return this.currencyRates$.pipe(
			map((response: { rates: Record<string, number> }) => {
				return function (amount: number, currencyCode: string): number | null {
					const rate = response.rates[currencyCode];
					if (rate == null) return null;
					return amount * rate;
				};
			})
		);
	}

	convertUSDToLocalCurrenct(
		amount: number,
		currencyCode: string
	): Observable<number | null> {
		return this.getConverterToLocalCurrenct().pipe(map((x) => x(amount, currencyCode)));
	}
}
