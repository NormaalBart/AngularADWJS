import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { GuestComponent } from './layout/guest/guest.component'
import { AdminComponent } from './layout/admin/admin.component'
import { PageLayout } from './enums/pagelayout.enum';
import { PageLayoutService } from './services/page-layout.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, GuestComponent, AdminComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  readonly PageLayout = PageLayout;
  
  constructor(public pageLayoutService: PageLayoutService) {}}
