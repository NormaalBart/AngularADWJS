import { Injectable } from '@angular/core';
import { BehaviorSubject, of, timer } from 'rxjs';
import { PageLayout } from '../enums/pagelayout.enum';
import { AuthService } from './auth.service';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PageLayoutService {

  private layoutSubject = new BehaviorSubject<PageLayout>(PageLayout.Loading);
  public layout$ = this.layoutSubject.asObservable();
  private isFirstEmission = true;

  constructor(private authService: AuthService) {
    this.authService.currentUserSignal
      .pipe(
        switchMap(user => {
          if (this.isFirstEmission) {
            this.isFirstEmission = false;
            return timer(environment.loginDelay).pipe(map(() => user));
          } else {
            return of(user);
          }
        })
      )
      .subscribe(_ => {
        if (this.authService.isAuthenticated()) {
          this.layoutSubject.next(PageLayout.Admin);
        } else {
          this.layoutSubject.next(PageLayout.Guest);
        }
      });
  }
}
