import { Component, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'
import { GuestComponent } from './layout/guest/guest.component'
import { AdminComponent } from './layout/admin/admin.component'
import { PageLayout } from './enums/pagelayout.enum';
import { PageLayoutService } from './services/page-layout.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { LoadingComponent } from './layout/loading/loading.component';
import { auditTime, debounceTime, delay } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, GuestComponent, AdminComponent, LoadingComponent],
 templateUrl: './app.component.html'
})
export class AppComponent {
  readonly PageLayout = PageLayout;

  constructor(public authService: AuthService, public pageLayoutService: PageLayoutService) {
    this.authService.user$
      .subscribe((user) => {
        this.authService.currentUserSignal.next(user);
      });
  }
}