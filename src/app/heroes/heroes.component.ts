import { Component } from '@angular/core'
import { NgFor, NgIf, UpperCasePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { HeroService } from '../hero.service'
import { Hero } from '../hero'
import { HeroDetailComponent } from '../hero-detail/hero-detail.component'
import { MessageService } from '../message.service'

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [UpperCasePipe, FormsModule, NgFor, NgIf, HeroDetailComponent],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent {
  heroes: Hero[] = []

  selectedHero?: Hero

  constructor (
    private heroService: HeroService,
    private messageService: MessageService
  ) {}

  ngOnInit (): void {
    this.getHeroes()
  }

  onSelect (hero: Hero): void {
    this.selectedHero = hero
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`)
  }

  getHeroes (): void {
    this.heroService.getHeroes().subscribe(heroes => (this.heroes = heroes))
  }
}
