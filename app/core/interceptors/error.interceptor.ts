import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Navigate } from "@ngxs/router-plugin";
import { Store } from "@ngxs/store";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AlertSuccess } from "../state/alert/alert.actions";
import { Logout } from "../state/auth/auth.actions";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private store: Store, readonly router: Router) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((err) => {
				if (err.status === 401) {
					this.store.dispatch(new Logout());
					this.store.dispatch(new Navigate(["/auth", "login"])); //, {returnUrl: url}
				} else {
					this.alertErr(err);
				}

				return throwError(err);
			})
		);
	}

	async alertErr(err: HttpErrorResponse): Promise<void> {
		const serverErrorMessage: string | null = await (async () => {
			if (err.error instanceof Blob === false) return null;
			let message: string | null = null;
			try {
				message = JSON.parse(await err.error.text())?.message;
			} catch {}
			if (typeof message !== "string") return null;
			message = message.trim();
			return message.length >= 1 ? message : null;
		})();

		const requestErrorMessage: string | null = (() => {
			let x = err.message;
			x = x.trim();
			return x.length >= 1 ? x : null;
		})();

		if (serverErrorMessage) {
			this.store.dispatch(new AlertSuccess(serverErrorMessage));
			return;
		}

		const defaultErrorMessage =
			"Oops! Something went wrong when trying to complete this task.";

		if (environment.production) {
			this.store.dispatch(new AlertSuccess(defaultErrorMessage));
		} else {
			this.store.dispatch(
				new AlertSuccess(requestErrorMessage ?? defaultErrorMessage)
			);
		}
	}
}
