import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-title-container',
  template: `
    <div class="root">
      <div class="property-title">{{title}}</div>
      <app-property-label-list
        *ngIf="labelListItems"
        [items]="labelListItems"
      ></app-property-label-list>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .property-title{
      font-size: 16px;
      color: rgb(195, 190, 185);
      font-weight: 200;
      margin-bottom: 5px;
    }
  `]
})
export class PropertyTitleContainerComponent implements OnInit {

  constructor() { }

  @Input() title: string = 'NO TITLE SPECIFIED';
  @Input() labelListItems?: string[] = undefined;

  ngOnInit(): void {
  }

}
