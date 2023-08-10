
import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AppSVGIconsService } from 'src/app/modules/shared/service/svg/app-svgicons.service';


@Component({
  selector: 'app-back-button-and-title-header',
  templateUrl: './back-button-and-title-header.component.html',
  styleUrls: ['./back-button-and-title-header.component.scss']
})
export class BackButtonAndTitleHeaderComponent implements OnInit {

  constructor(
    private location: Location,
    readonly svg: AppSVGIconsService,
  ) {}

  @Input() title = 'No Title Specified';
  @Input() customBackButtonAction?: () => void = undefined;
 
  onBackButtonClicked(){
    if (this.customBackButtonAction){
      this.customBackButtonAction();
    } else {
      this.location.back();
    }
  }

  ngOnInit(): void {
  }

}
