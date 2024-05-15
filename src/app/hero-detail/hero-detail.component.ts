import { Component, OnInit } from '@angular/core'
import { Hero } from '../hero'
import { CommonModule, Location } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { HeroService } from '../hero.service'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined

  constructor (
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit (): void {
    this.getHero()
  }

  getHero (): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.heroService.getHero(id).subscribe(hero => (this.hero = hero))
  }

  goBack (): void {
    this.location.back()
  }
}
