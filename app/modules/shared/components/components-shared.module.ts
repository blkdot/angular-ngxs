import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { RouterModule } from "@angular/router";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxImageCompressService } from "ngx-image-compress";
import { SharedDirectivesModule } from "../directives/shared-directives.module";
import { MainAppLoaderComponent } from "../main-app-loader/main-app-loader.component";
import { MainAppLoaderModule } from "../main-app-loader/main-app-loader.module";
import { SharedPipesModule } from "../pipes/shared-pipes.module";
import { UploadService } from "../service/upload/upload.service";
import { BackButtonAndTitleHeaderComponent } from "./back-button-and-title-header/back-button-and-title-header.component";
import { BigTitleWithDropdownComponent } from "./big-title-with-dropdown/big-title-with-dropdown.component";
import { ChipListComponent } from "./chip-list/chip-list.component";
import { ComponentInjectorComponent } from "./component-injector/component-injector.component";
import { EditHeaderComponent } from "./edit-header/edit-header.component";
import { FilterChipListComponent } from "./filter-chip-list/filter-chip-list.component";
import { FormErrorsListViewComponent } from "./form-errors-list-view/form-errors-list-view.component";
import { FormPhotoListComponent } from "./form-photo-list/form-photo-list.component";
import { HashtagChipListViewComponent } from "./hashtag-chip-list-view/hashtag-chip-list-view.component";
import { ImageSliderHeaderComponent } from "./image-slider-header/image-slider-header.component";
import { MainOptionListComponent } from "./main-option-list/main-option-list.component";
import { PersonContactButtonsComponent } from "./person-contact-buttons/person-contact-buttons.component";
import { PopupSectionHolderComponent } from "./popup-section-holder/popup-section-holder.component";
import { PropertyLabelListComponent } from "./property-label-list/property-label-list.component";
import { PropertyLabelComponent } from "./property-label/property-label.component";
import { PropertyTitleContainerComponent } from "./property-title-container.component";
import { CategorySelectorComponent } from "./screen-headers/child-components/category-selector/category-selector.component";
import { CitySearchFieldComponent } from "./screen-headers/child-components/city-search-field/city-search-field.component";
import { HomeFilterPopupComponent } from "./screen-headers/child-components/home-filter-popup/home-filter-popup.component";
import { MainScreenSideButtonsComponent } from "./screen-headers/child-components/main-screen-side-buttons/main-screen-side-buttons.component";
import { MenuButtonComponent } from "./screen-headers/child-components/main-screen-side-buttons/menu-button/menu-button.component";
import { MyBagButtonComponent } from "./screen-headers/child-components/main-screen-side-buttons/my-bag-button/my-bag-button.component";
import { SubcategoriesComponent } from "./screen-headers/child-components/subcategories/subcategories.component";
import { CitySearchFieldWithSideButtonsComponent } from "./screen-headers/city-search-field-with-side-buttons/city-search-field-with-side-buttons.component";
import { LargeImageAndTitleHeaderComponent } from "./screen-headers/large-image-and-title-header/large-image-and-title-header.component";
import { ProductCategoriesAndSubcategoriesComponent } from "./screen-headers/product-categories-and-subcategories/product-categories-and-subcategories.component";
import { WideEventOptionListHeaderComponent } from "./screen-headers/wide-option-list-header/wide-event-option-list-header/wide-event-option-list-header.component";
import { WideOptionListHeaderComponent } from "./screen-headers/wide-option-list-header/wide-option-list-header.component";
import { ScreenSectionHolderComponent } from "./screen-section-holder/screen-section-holder.component";
import { AuthScreenTemplateComponent } from "./screens/auth-screen-template/auth-screen-template.component";
import { BottomSearchBarScreenComponent } from "./screens/bottom-search-bar-screen/bottom-search-bar-screen.component";
import { PopInScreenComponent } from "./screens/pop-in-screen/pop-in-screen.component";
import { PopUpScreenComponent } from "./screens/pop-up-screen/pop-up-screen.component";
import { PopUpScreensFlowComponent } from "./screens/pop-up-screens-flow/pop-up-screens-flow.component";
import { SelectPhotoScreenComponent } from "./screens/select-photo-screen/select-photo-screen.component";
import { SlideUpScreenComponent } from "./screens/slide-up-screen/slide-up-screen.component";
import { VendorInfoComponent } from "./vendor-info/vendor-info.component";

@NgModule({
	declarations: [
		PropertyLabelComponent,
		PropertyLabelListComponent,
		EditHeaderComponent,
		VendorInfoComponent,
		FormPhotoListComponent,
		AuthScreenTemplateComponent,
		BottomSearchBarScreenComponent,
		BackButtonAndTitleHeaderComponent,
		PopUpScreenComponent,
		BigTitleWithDropdownComponent,
		SubcategoriesComponent,
		CitySearchFieldComponent,
		MenuButtonComponent,
		CitySearchFieldWithSideButtonsComponent,
		ScreenSectionHolderComponent,
		CategorySelectorComponent,
		SelectPhotoScreenComponent,
		ChipListComponent,
		PropertyTitleContainerComponent,
		MainScreenSideButtonsComponent,
		ImageSliderHeaderComponent,
		MyBagButtonComponent,
		PersonContactButtonsComponent,
		FormErrorsListViewComponent,
		MainOptionListComponent,
		PopInScreenComponent,
		SlideUpScreenComponent,
		HashtagChipListViewComponent,
		ProductCategoriesAndSubcategoriesComponent,
		LargeImageAndTitleHeaderComponent,
		WideOptionListHeaderComponent,
		WideEventOptionListHeaderComponent,
		ComponentInjectorComponent,
		PopUpScreensFlowComponent,
		HomeFilterPopupComponent,
		FilterChipListComponent,
		PopupSectionHolderComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		NgbCarouselModule,
		SharedDirectivesModule,
		SharedPipesModule,
		MatAutocompleteModule,
		MainAppLoaderModule,
	],
	exports: [
		PropertyLabelComponent,
		PropertyLabelListComponent,
		EditHeaderComponent,
		VendorInfoComponent,
		MainAppLoaderComponent,
		FormPhotoListComponent,
		AuthScreenTemplateComponent,
		BottomSearchBarScreenComponent,
		BackButtonAndTitleHeaderComponent,
		PopUpScreenComponent,
		BigTitleWithDropdownComponent,
		SubcategoriesComponent,
		CitySearchFieldComponent,
		MenuButtonComponent,
		CitySearchFieldWithSideButtonsComponent,
		ScreenSectionHolderComponent,
		CategorySelectorComponent,
		SelectPhotoScreenComponent,
		ChipListComponent,
		PropertyTitleContainerComponent,
		MainScreenSideButtonsComponent,
		ImageSliderHeaderComponent,
		MyBagButtonComponent,
		PersonContactButtonsComponent,
		FormErrorsListViewComponent,
		MainOptionListComponent,
		PopInScreenComponent,
		SlideUpScreenComponent,
		HashtagChipListViewComponent,
		ProductCategoriesAndSubcategoriesComponent,
		LargeImageAndTitleHeaderComponent,
		WideOptionListHeaderComponent,
		WideEventOptionListHeaderComponent,
		PopUpScreensFlowComponent,
		HomeFilterPopupComponent,
		FilterChipListComponent,
		PopupSectionHolderComponent
	],
	providers: [UploadService, HttpClient, NgxImageCompressService],
})
export class SharedComponentsModule {}
