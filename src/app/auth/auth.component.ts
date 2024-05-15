import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'auth-wrapper',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

}
