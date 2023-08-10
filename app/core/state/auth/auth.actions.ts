import {
	ICreateAccountRequest,
	IRecoverPasswordRequest,
} from "../../api/api-client.service";

export class PwdLogin {
	static readonly type = "[Auth] Login";

	constructor(public payload: { userName: string; password: string }) {}
}

export class SetToken {
	static readonly type = "[Auth] Token";
	constructor(public payload: { token: string }) {}
}

export class Logout {
	static readonly type = "[Auth] Logout";
}

export class Register {
	static readonly type = "[Auth] Registration";

	constructor(public payload: ICreateAccountRequest) {}
}

export class RecoveryStart {
	static readonly type = "[Auth] Recovery Start";

	constructor(public payload: IRecoverPasswordRequest) {}
}

export class GuestSignIn {
	static readonly type = "[Auth] GuestSignIn";

	constructor(public payload: { cityId: string }) {}
}
