import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ReplaySubject} from "rxjs";
import {first} from "rxjs/operators";
import {ApiClient, ConfirmUserRequest} from "../../../core/api/api-client.service";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmComponent implements OnInit {

  private sub: any;
  token: string;
  userName: string;
  message$ = new ReplaySubject<boolean>(1);
  
  constructor(private route: ActivatedRoute, private api: ApiClient) { }

  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.userName = params['userName'];
      
      this.api.confirmEmail(new ConfirmUserRequest({confirmationToken: this.token, userName: this.userName}))
          .pipe(first()).subscribe({next: () => this.message$.next(true), error: () =>  this.message$.next(false)});
    });    
  }
}
