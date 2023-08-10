import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ConvertToPhyPipe } from "./convert-to-phy.pipe";
import { IfNullishPipe } from "./if-nullish.pipe";
import { LocalizedCurrencyPipe } from "./localized-currency.pipe";
import { LocalizedWeightPipe } from "./localized-weight.pipe";
import { S3ImageUrlArrayPipe } from "./s3-image-url-array.pipe";
import { S3ImageUrlPipe } from "./s3-image-url.pipe";

@NgModule({
	declarations: [
		LocalizedCurrencyPipe,
		LocalizedWeightPipe,
		S3ImageUrlArrayPipe,
		S3ImageUrlPipe,
		IfNullishPipe,
		ConvertToPhyPipe,
	],
	imports: [CommonModule],
	exports: [
		LocalizedCurrencyPipe,
		LocalizedWeightPipe,
		S3ImageUrlArrayPipe,
		S3ImageUrlPipe,
		IfNullishPipe,
		ConvertToPhyPipe,
	],
})
export class SharedPipesModule {}
