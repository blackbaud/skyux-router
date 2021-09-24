import { Component, Input } from '@angular/core';
import { SkyHrefParameters } from '../types/href-parameters';

@Component({
  selector: 'sky-smart-link-fixture',
  templateUrl: 'href-fixture.component.html'
})
export class HrefDirectiveFixtureComponent {
  @Input()
  public dynamicLink = '1bb-nav://simple-app/';

  @Input()
  public dynamicElse = 'hide';

  @Input()
  public parameters: SkyHrefParameters;
}
