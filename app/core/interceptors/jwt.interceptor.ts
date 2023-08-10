import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AuthState } from "../state/auth/auth.state";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private store: Store) {}

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		const token = this.store.selectSnapshot(AuthState.token);
		if (token) {
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`,
				},
			});
		}

		return next.handle(req);
	}
}
