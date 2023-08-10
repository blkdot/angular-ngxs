
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MainOptionListComponent } from '../main-option-list/main-option-list.component';

@Component({
  selector: 'app-big-title-with-dropdown',
  templateUrl: './big-title-with-dropdown.component.html',
  styleUrls: ['./big-title-with-dropdown.component.scss']
})
export class BigTitleWithDropdownComponent implements OnInit {

  @Input() control = new FormControl();
  @Input() leftText: string | null = 'in';
  @Input() placeholder = 'type here...';
  @Input() options: MainOptionListComponent['options'];
  @Input() getValueForOption: MainOptionListComponent['getValueForOption'];
  @Input() getNameForOption: MainOptionListComponent['getNameForOption'];
  @Input() getEqualityForOptions: MainOptionListComponent['getEqualityForOptions'] = null;
  @Input() isFilteringEnabled: boolean = true;
  
  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild(MainOptionListComponent) 
  private mainOptionList: MainOptionListComponent;

  openAutocompleteList(){
    this.mainOptionList?.openAutocompleteList();    
  }

}
