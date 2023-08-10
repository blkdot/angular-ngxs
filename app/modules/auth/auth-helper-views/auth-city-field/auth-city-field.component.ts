import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import {
	debounceTime,
	distinctUntilChanged,
	map,
	switchMap,
} from "rxjs/operators";
import { ComponentUtils } from "src/app/core/domain/ComponentUtils";
import { shareReplayLastUntil } from "src/app/sharedJs/observableStuff";
import {
	ApiClient,
	CitySearchModel,
} from "../../../../core/api/api-client.service";

@Component({
	selector: "app-auth-city-field",
	templateUrl: "./auth-city-field.component.html",
	styleUrls: ["./auth-city-field.component.scss"],
})
export class AuthCityFieldComponent extends ComponentUtils implements OnInit {
	@Input() control: FormControl;
	@Output() onEnterKeyPressed = new EventEmitter<null>();

	readonly filteredCities$ = this.inputChangesFor$("control").pipe(
		switchMap((x) => x.asObservable()),
		map((x) => {
			if (typeof x === "string") {
				return x.trim();
			} else return "";
		}),
		distinctUntilChanged(),
		debounceTime(250),
		switchMap((x) => this.apiClient.searchCity(x, false)),
		shareReplayLastUntil(this.disposed$)
	);

	constructor(private apiClient: ApiClient) {
		super();
	}

	changeCitySelection(selectedCity: CitySearchModel) {
		return selectedCity.cityName;
	}

	ngOnInit(): void {}
}
