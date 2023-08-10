import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "ifNullishThen",
})
export class IfNullishPipe<T> implements PipeTransform {
	transform(value: T | null | undefined, defaultValue: T): T {
		return value ?? defaultValue;
	}
}
