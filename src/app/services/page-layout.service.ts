import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { PageLayout } from '../enums/pagelayout.enum'
import { inject } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot
} from '@angular/router'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class PageLayoutService {
  private authService = inject(AuthService)
  private layoutSubject = new Subject<PageLayout>()
  public layout$ = this.layoutSubject.asObservable()

  calculateLayout () {
    if (this.authService.isAuthenticated()) {
      this.layoutSubject.next(PageLayout.Admin)
    } else {
      this.layoutSubject.next(PageLayout.Guest)
    }
  }
}

export const setLayout = (): ResolveFn<void> => {
  return (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    inject(PageLayoutService).calculateLayout()
  }
}
