import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-closingcontent',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './closingcontent.component.html',
})
export class ClosingcontentComponent {

  isContentVisible: boolean = false;
  @Input() title: string = '';

  toggleContent() {
    this.isContentVisible = !this.isContentVisible;
  }
}
