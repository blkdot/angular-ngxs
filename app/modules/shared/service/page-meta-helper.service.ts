
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

type PageMetaInfo = {
  title: string;
}

const DEFAULT_META_INFO: PageMetaInfo = {
  title: 'Swapacrop.com. Community based. Transparent. Quality.'
};


@Injectable({
  providedIn: 'root'
})
export class PageMetaHelperService {

  private readonly routeInfo = new Map<string, PageMetaInfo>();

  constructor(
    readonly router: Router,
    readonly location: Location,
  ) { 
    router.events.pipe(
      filter(x => x instanceof NavigationEnd),
    ).subscribe(() => {
      this._updateMetaInfo();
    })
  }

  setForCurrentRoute(metaInfo: PageMetaInfo){
    this.routeInfo.set(this._getCurrentPath(), metaInfo);
    this._updateMetaInfo();
  }

  private _updateMetaInfo(){
    document.title = this.routeInfo.get(this._getCurrentPath())?.title ?? DEFAULT_META_INFO.title;
  }

  private _getCurrentPath(){
    return this.location.path(false);
  }

}
