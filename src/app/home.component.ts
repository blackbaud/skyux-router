import { Component } from '@angular/core';
import { SkyAppLinkQueryParams } from './public/public_api';

@Component({
  selector: 'app-home',
  template: `
<a skyAppLink="foobar" [queryParams]="queryParams">SKY UX link</a>
<a routerLink="foobar" [queryParams]="{foo: 'bar'}">Normal link.</a>
`
})
export class HomeComponent {
  public queryParams: SkyAppLinkQueryParams;

  constructor() {
    setTimeout(() => {
      this.queryParams = {
        bar: 'baz'
      };
    }, 1000);
  }
}
