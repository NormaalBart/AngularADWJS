import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  logout() {
    console.log(this.authService);
    this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
    });
  }
}
