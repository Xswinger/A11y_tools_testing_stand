import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AriaViolationsComponent } from '../components/aria-violations/aria-violations';
import { HeadingsViolationsComponent } from '../components/headings-violations/headings-violations';
import { ImagesViolationsComponent } from '../components/images-violations/images-violations';
import { FormsViolationsComponent } from '../components/forms-violations/forms-violations';
import { LinksViolationsComponent } from '../components/links-violations/links-violations';
import { LandmarksViolationsComponent } from '../components/landmarks-violations/landmarks-violations';
import { TablesViolationsComponent } from '../components/tables-violations/tables-violations';
import { MiscViolationsComponent } from '../components/misc-violations/misc-violations';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AriaViolationsComponent,
    HeadingsViolationsComponent,
    ImagesViolationsComponent,
    FormsViolationsComponent,
    LinksViolationsComponent,
    LandmarksViolationsComponent,
    TablesViolationsComponent,
    MiscViolationsComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-ssr');
}
