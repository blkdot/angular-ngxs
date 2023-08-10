import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {
	ApiClient,
	CreateAccountRequest,
	PwdAuthRequest,
	PwdAuthResponse,
	RecoverPasswordRequest,
} from "../../api/api-client.service";
import {
	GuestSignIn,
	Logout,
	PwdLogin,
	RecoveryStart,
	Register,
	SetToken,
} from "./auth.actions";
import { AuthStateModel } from "./auth.model";

@State<AuthStateModel>({
	name: "auth",
	defaults: {
		token: null,
	},
})
@Injectable()
export class AuthState {
	@Selector()
	static token(state: AuthStateModel): string | null {
		return state.token;
	}

	@Selector()
	static isAuthenticated(state: AuthStateModel): boolean {
		return !!state.token;
	}

	constructor(private api: ApiClient, private http: HttpClient) {}

	@Action(PwdLogin)
	login(
		ctx: StateContext<AuthStateModel>,
		{ payload }: PwdLogin
	): Observable<PwdAuthResponse> {
		return this.api.auth(new PwdAuthRequest(payload)).pipe(
			tap(({ token }) => {
				ctx.setState({
					token,
				});
			})
		);
	}

	@Action(SetToken)
	setToken(
		ctx: StateContext<AuthStateModel>,
		{ payload: { token } }: SetToken
	) {
		ctx.setState({
			token,
		});
	}

	@Action(Logout)
	logout(ctx: StateContext<AuthStateModel>): void {
		ctx.setState({
			token: null,
		});
	}

	@Action(Register)
	registration(
		ctx: StateContext<AuthStateModel>,
		{ payload }: Register
	): Observable<PwdAuthResponse> {
		return this.api.createUser(new CreateAccountRequest(payload)).pipe(
			tap(({ token }) => {
				ctx.setState({
					token,
				});
			})
		);
	}

	@Action(RecoveryStart)
	restore(
		ctx: StateContext<AuthStateModel>,
		{ payload }: RecoveryStart
	): Observable<void> {
		return this.api.recoveryPOST(new RecoverPasswordRequest(payload));
	}

	@Action(GuestSignIn)
	guestSignIn(
		ctx: StateContext<AuthStateModel>,
		{ payload }: GuestSignIn
	): Observable<PwdAuthResponse> {
		return this.api.guestSignIn(payload.cityId).pipe(
			tap(({ token }) => {
				ctx.setState({
					token,
				});
			})
		);
	}
}
