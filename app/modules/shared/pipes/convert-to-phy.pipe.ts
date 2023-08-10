import { ChangeDetectorRef, Pipe, PipeTransform } from "@angular/core";
import { Store } from "@ngxs/store";
import { map, takeUntil } from "rxjs/operators";
import { ComponentUtils } from "src/app/core/domain/ComponentUtils";
import { LocalizationState } from "src/app/core/state/localization/localization.state";
import {
	getFormattedPriceText,
	mapOptional,
	PriceTextOptions,
} from "src/app/sharedJs/general";
import {
	CurrencyConverterFn,
	CurrencyConverterService,
} from "../service/currency-converter.service";

@Pipe({
	name: "convertToPhy",
	pure: false,
})
export class ConvertToPhyPipe extends ComponentUtils implements PipeTransform {
	private marketCurrencyCode: string | null | undefined = undefined;
	private convertToPHY: CurrencyConverterFn | null | undefined = undefined;

	constructor(
		readonly store: Store,
		readonly cd: ChangeDetectorRef,
		readonly currencyConverter: CurrencyConverterService
	) {
		super();
		store
			.select(LocalizationState.localization)
			.pipe(
				map((x) => x.currencyCode),
				takeUntil(this.disposed$)
			)
			.subscribe((currencyCode) => {
				this.marketCurrencyCode = currencyCode;
				cd.markForCheck();
			});

		currencyConverter
			.getConverterToPHY()
			.pipe(takeUntil(this.disposed$))
			.subscribe((converter) => {
				this.convertToPHY = converter;
				cd.markForCheck();
			});
	}

	transform(
		value: number,
		options?: Omit<PriceTextOptions, "numberFormat" | "currencyPrefix"> & {
			currencyCode?: string;
		}
	): string {
		return mapOptional(
			options?.currencyCode ?? this.marketCurrencyCode,
			(currencyCode) =>
				mapOptional(
					this.convertToPHY?.(value, currencyCode),
					(valueConvertedToPHY) => {
						return getFormattedPriceText(Math.round(valueConvertedToPHY), {
							...(options ?? {}),
							currencyPrefix: "PTS",
							numberFormat: "short",
						});
					}
				)
		);
	}
}
