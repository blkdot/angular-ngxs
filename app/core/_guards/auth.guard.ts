import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	Router,
	RouterStateSnapshot,
} from "@angular/router";
import { Store } from "@ngxs/store";
import jwtDecode from "jwt-decode";
import { Observable } from "rxjs";
import { filter, first, map, tap } from "rxjs/operators";
import { IProfileStateModel } from "src/app/modules/dash/state/models/profile.models";
import { ProfileState } from "src/app/modules/dash/state/states/profile.state";
import { matchRoute } from "src/app/sharedJs/general";
import { AlertSuccess } from "../state/alert/alert.actions";
import { SetToken } from "../state/auth/auth.actions";
import { AuthState } from "../state/auth/auth.state";
import { UIActions } from "../state/ui/ui.actions";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild {
	constructor(private store: Store, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
		return this._allowRoute(routerState.url, route);
	}

	canActivateChild(
		route: ActivatedRouteSnapshot,
		{ url }: RouterStateSnapshot
	) {
		return this._allowRoute(url, route);
	}

	private _allowRoute(url: string, route: ActivatedRouteSnapshot) {
		const isAuthenticated = this.store.selectSnapshot(
			AuthState.isAuthenticated
		);

		const orderDetailsDeepLinkMatch =
			this.matchOrderDetailDeepLink_withValidToken(url);
		if (orderDetailsDeepLinkMatch) {
			this.store.dispatch(
				new SetToken({ token: orderDetailsDeepLinkMatch.token })
			);
		}

		if (isAuthenticated) {
			return this._canLoggedInUserAccessUrl(url).pipe(
				tap((allowRoute) => {
					if (allowRoute === false) {
						this.store.dispatch(
							new AlertSuccess(
								"Sorry, you aren't authorized to access that page."
							)
						);
						this.router.navigate(["/"]);
					}
				})
			);
		} else {
			const allowRoute = this._canUnauthenticatedUserAccessUrl(url);
			if (!allowRoute) {
				if (this.router.navigated) {
					this.store.dispatch(
						new UIActions.ShowLogInToContinueScreen({ returnUrlPath: url })
					);
				} else {
					this.router.navigate(["auth", "login"]);
				}
			}
			return allowRoute;
		}
	}

	private _canLoggedInUserAccessUrl(url: string): Observable<boolean> {
		return this.store.select<IProfileStateModel>(ProfileState).pipe(
			filter((x) => x.currentUserProfile != null),
			first(),
			map((profileState) => {
				if (matchRoute("/app/products/wholesale", url)) {
					return ProfileState.canViewWholesaleScreen(profileState);
				}
				const editProfileMatch = matchRoute<"profileId">(
					"/app/profile/edit/:profileId",
					url
				);
				if (editProfileMatch) {
					return (
						profileState.currentUserProfile.isSuperUser ||
						profileState.currentUserProfile.id === editProfileMatch.profileId
					);
				}
				return true;
			})
		);
	}

	private _canUnauthenticatedUserAccessUrl(url: string) {
		const allowRoute =
			!!matchRoute("/app/events/:id", url) ||
			(!!matchRoute("/app/products/detail/:id", url) &&
				this.router.navigated === false) ||
			!!matchRoute("/app/events/withInitialEventId/:initialEventId", url) ||
			!!matchRoute("/app/events/shop-event/:eventId", url) ||
			!!this.matchOrderDetailDeepLink_withValidToken(url);
		return allowRoute;
	}

	private matchOrderDetailDeepLink_withValidToken(url: string) {
		const match = matchRoute<"id" | "token">(
			"/app/orders/detail/:id/:token",
			url
		);
		if (match) {
			const exp = jwtDecode<{ exp?: number }>(match.token)?.exp;
			if (typeof exp === "number" && exp < Date.now() / 1000) return null;
			else return match;
		} else {
			return null;
		}
	}
}
