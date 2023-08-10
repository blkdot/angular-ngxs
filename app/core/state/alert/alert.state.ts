import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { AlertError, AlertSuccess } from "./alert.actions";
import { IAlertModel } from "./alert.model";

@State<IAlertModel | null>({
	name: "alert",
	defaults: null,
})
@Injectable()
export class AlertState {
	@Action(AlertError)
	error(ctx: StateContext<IAlertModel>, { payload }: AlertError): void {
		ctx.setState({
			message: payload,
			type: "error",
		});
	}

	@Action(AlertSuccess)
	success(ctx: StateContext<IAlertModel>, { payload }: AlertError): void {
		ctx.setState({
			message: payload,
			type: "success",
		});
	}
}
