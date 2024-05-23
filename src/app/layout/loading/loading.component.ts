import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'loading-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
}
