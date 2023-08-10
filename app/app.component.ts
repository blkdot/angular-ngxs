import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
	ActivatedRoute,
	Event,
	NavigationEnd,
	ParamMap,
	Params,
	RouteConfigLoadEnd,
	RouteConfigLoadStart,
	Router,
	RoutesRecognized,
} from "@angular/router";
import { Actions, Select, Store } from "@ngxs/store";
import { Observable, combineLatest, of } from "rxjs";
import { filter, switchMap, takeUntil, pluck, tap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ComponentUtils } from "./core/domain/ComponentUtils";
import { AlertState } from "./core/state/alert/alert.state";
import { AuthState } from "./core/state/auth/auth.state";
import { UIActions } from "./core/state/ui/ui.actions";
import { UIState } from "./core/state/ui/ui.state";
import { ProfileState } from "./modules/dash/state/states/profile.state";
import { SiteAccessSourceService } from "./modules/shared/service/sign-up-invited-by.service";
import { OrderTimePassedPopupComponent } from "./order-time-passed-popup/order-time-passed-popup.component";
import { CustomAnimations } from "./sharedJs/CustomAnimations";
import {
	bootIntercom,
	removeIntercomUserDetails,
	setIntercomShown,
	setIntercomUserDetails,
} from "./sharedJs/intercom/intercom";
import { combineLatestObj } from "./sharedJs/observableStuff";
import "./sharedJs/prototypeExtensions";
@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	animations: [CustomAnimations.FadeUp],
})
export class AppComponent extends ComponentUtils implements OnInit {
	@Select(UIState.shouldNavMenuBeShown) shouldShowMenu$: Observable<boolean>;
	@Select(UIState.shouldLogInToContinueBeShown)
	shouldLogInToContinueBeShown$: Observable<boolean>;
	@Select(UIState.productUnavailableScreenInfo)
	productUnavailableScreenInfo$: Observable<
		ReturnType<typeof UIState.productUnavailableScreenInfo>
	>;
	@Select(UIState.routerHistory)
	routerHistory$: Observable<
		ReturnType<typeof UIState.routerHistory>
	>;

	@ViewChild(OrderTimePassedPopupComponent)
	productUnavailableScreen: OrderTimePassedPopupComponent;

	constructor(
		readonly store: Store,
		readonly snackBar: MatSnackBar,
		readonly router: Router,
		readonly route: ActivatedRoute,
		readonly actions: Actions,
		readonly siteAccessSource: SiteAccessSourceService
	) {
		super();
		this.setUpFixForScreenHeightOnIPhone();
	}

	ngOnInit() {
		this.addClickyAnalyticsScriptToDom();
		this.setUpAlertListener();
		this.setUpLazyLoadingModulesListener();
		this.setUpListenerToDismissLogInToContinueScreen();
		this.setUpListenerToTrackRouterHistory();
		this.setUpListenerToDismissMainAppMenu();
		this.setUpListenerToDisplayProductUnavailableScreen();
		this.siteAccessSource.storeAccessSourceIfNeeded();
		this.setUpLiveChatFunctionality();
	}

	setUpListenerToDisplayProductUnavailableScreen() {
		this.productUnavailableScreenInfo$.subscribe((info) => {
			if (info == null && this.productUnavailableScreen?.isPresented) {
				this.productUnavailableScreen?.dismiss();
			} else if (info != null) {
				this.productUnavailableScreen?.present();
			}
		});
	}

	/// keep track of all navigations within the system. Needed for back navigation functionality
	setUpListenerToTrackRouterHistory() {
		this.router.events
			.pipe(
				filter(x => x instanceof RoutesRecognized),
				switchMap(x => combineLatest([of(x), this.routerHistory$])),
				takeUntil(this.disposed$)
			)
			.subscribe(([current, routerHistory]: [RoutesRecognized, NavigationEnd[]]) => {
				if (routerHistory && routerHistory.length) {
					if (routerHistory[routerHistory.length - 1]?.url !== current?.url) {
						return this.store.dispatch(new UIActions.SetRouterHistory([...routerHistory, {
							id: current.id,
							url: current.url,
							urlAfterRedirects: current.urlAfterRedirects,
							params: current?.state?.root?.firstChild?.params
						}]));
					}
				} else {
					return this.store.dispatch(new UIActions.SetRouterHistory([{
						id: current.id,
						url: current.url,
						urlAfterRedirects: current.urlAfterRedirects,
						params: current?.state?.root?.firstChild?.params
					}]));
				}
			});
	}

	/// this dismisses the menu whenever the current route changes
	setUpListenerToDismissMainAppMenu() {
		this.router.events
			.pipe(
				filter((x) => x instanceof NavigationEnd),
				takeUntil(this.disposed$)
			)
			.subscribe(() => {
				this.store.dispatch(new UIActions.SetNavMenuShown(false));
			});
	}

	setUpListenerToDismissLogInToContinueScreen() {
		this.router.events
			.pipe(
				filter((x) => x instanceof NavigationEnd),
				takeUntil(this.disposed$)
			)
			.subscribe(() => {
				this.store.dispatch(new UIActions.HideLogInToContinueScreen());
			});
	}

	setUpLazyLoadingModulesListener() {
		this.router.events.pipe(takeUntil(this.disposed$)).subscribe((event) => {
			if (event instanceof RouteConfigLoadStart) {
				this.loader.oneTaskStartedLoading();
			} else if (event instanceof RouteConfigLoadEnd) {
				this.loader.oneTaskFinishedLoading();
			}
		});
	}

	// the below code helps to pin the body to the edges of browser window, even on ios devices. it is used in combination with code in styles.scss
	setUpFixForScreenHeightOnIPhone() {
		const appHeight = () => {
			const heightSetter = () => {
				const newValue = `${window.innerHeight}px`;
				const propKey = "--app-height";
				const style = document.documentElement.style;
				if (style.getPropertyValue(propKey) !== newValue) {
					style.setProperty(propKey, newValue);
				}
			};

			heightSetter();

			// this needs to be executed additionally in the following two setTimeout's because otherwise, on chrome for ios (and probably on other browsers), when the user rotates their phone, the height of the window isn't updated soon enough, and the height of the body stays the same
			setTimeout(heightSetter, 0);
			setTimeout(heightSetter, 100);
		};
		window.addEventListener("resize", appHeight);
		appHeight();
	}

	addClickyAnalyticsScriptToDom() {
		if (environment.production) {
			let script = document.createElement("script");
			script.setAttribute("src", "//static.getclicky.com/101327834.js");
			script.setAttribute("async", "");
			document.body.appendChild(script);
		}
	}

	setUpAlertListener() {
		this.store
			.select(AlertState)
			.pipe(
				takeUntil(this.disposed$),
				filter((x) => x != null)
			)
			.subscribe((alert) => {
				this.snackBar.open(alert.message, "OK", {
					panelClass: "mat-snack-bar-panel",
					duration: 10_000,
					verticalPosition: "top",
				});
			});
	}

	setUpLiveChatFunctionality() {
		if (environment.production === false) return;
		bootIntercom();

		const routeChanged$: Observable<NavigationEnd> = this.router.events.pipe(
			filter((x) => x instanceof NavigationEnd)
		) as Observable<NavigationEnd>;

		combineLatestObj({
			routeChanged: routeChanged$,
			isUserLoggedIn: this.store.select(AuthState.isAuthenticated),
			userProfile: this.store.select(ProfileState.currentUserProfile),
		})
			.pipe(takeUntil(this.disposed$))
			.subscribe(({ routeChanged, userProfile, isUserLoggedIn }) => {
				if (userProfile != null && isUserLoggedIn) {
					setIntercomUserDetails({
						name: userProfile.fullName,
						email: userProfile.email,
						phoneNumber: userProfile.phone,
						userId: userProfile.id,
					});
				} else {
					removeIntercomUserDetails();
				}
				setIntercomShown(routeChanged.url === "/" || userProfile != null);
			});
	}
}
