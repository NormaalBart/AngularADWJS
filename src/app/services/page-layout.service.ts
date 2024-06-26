import { Injectable, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Observable, filter, switchMap, tap, timer } from 'rxjs';
import { PageLayout } from '../enums/pagelayout.enum';
import { AuthService } from './auth.service';
import { environment } from '../../environments/global';

@Injectable({
  providedIn: 'root'
})
export class PageLayoutService {

  private authService = inject(AuthService);

  private layoutSubject = new BehaviorSubject<PageLayout>(PageLayout.Loading);
  layout$ = this.layoutSubject.asObservable();

  constructor() {
    let isFirstAuthCheck = true;
    const started = Date.now();
    this.authService.currentUser$
      .pipe(
        filter(user => user !== undefined),
        switchMap(_ => {
          if (isFirstAuthCheck) {
            const elapsed = Date.now() - started;
            const remainingDelay = Math.max(environment.authCheckDelay - elapsed, 0);
            return timer(remainingDelay);
          } else {
            return timer(0);
          }
        }),
        tap(() => {
          isFirstAuthCheck = false;
          if (this.authService.isAuthenticated()) {
            this.layoutSubject.next(PageLayout.Admin);
          } else {
            this.layoutSubject.next(PageLayout.Guest);
          }
        })
      )
      .subscribe();
  }
}
