import { Component } from '@angular/core'
import { HeroService } from '../hero.service'
import { Hero } from '../hero'
import { MessageService } from '../message.service'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent {
  heroes: Hero[] = []

  constructor (
    private heroService: HeroService,
    private messageService: MessageService
  ) {}

  ngOnInit (): void {
    this.getHeroes()
  }

  getHeroes (): void {
    this.heroService.getHeroes().subscribe(heroes => (this.heroes = heroes))
  }
}
