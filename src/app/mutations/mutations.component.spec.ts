import { TestBed } from '@angular/core/testing';
import { MutationsComponent } from './mutations.component';
import { MutationService } from '../services/mutations.service';
import { CategoryService } from '../services/categories.service';
import { ProjectService } from '../services/project.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Timestamp } from '@angular/fire/firestore';
import { Category } from '../models/category.interface';
import { Mutation } from '../models/mutation.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

describe('MutationsComponent', () => {
    let component: MutationsComponent;
    let fixture: any;
    let mutationServiceMock: any;
    let categoryServiceMock: any;
    let projectServiceMock: any;

    beforeEach(async () => {
        mutationServiceMock = jasmine.createSpyObj('MutationService', ['mutations$']);
        mutationServiceMock.mutations$ = of([
            {
                id: '1',
                title: 'Test Mutation 1',
                amount: 100,
                date: Timestamp.fromDate(new Date()),
                person: 'User 1',
                projectId: 'project1',
                categoryId: 'cat1',
            } as Mutation,
            {
                id: '2',
                title: 'Test Mutation 2',
                amount: 200,
                date: Timestamp.fromDate(new Date()),
                person: 'User 2',
                projectId: 'project1',
                categoryId: 'cat2',
            } as Mutation,
        ]);

        categoryServiceMock = jasmine.createSpyObj('CategoryService', ['categories$']);
        categoryServiceMock.categories$ = of([
            { id: 'cat1', name: 'Category 1', maxBudget: 500 } as Category,
            { id: 'cat2', name: 'Category 2', maxBudget: 1000 } as Category,
        ]);

        projectServiceMock = jasmine.createSpyObj('ProjectService', ['activeProject$']);
        projectServiceMock.activeProject$ = of({ id: 'project1' });

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot(),
                DragDropModule,
                MutationsComponent,
            ],
            providers: [
                { provide: MutationService, useValue: mutationServiceMock },
                { provide: CategoryService, useValue: categoryServiceMock },
                { provide: ProjectService, useValue: projectServiceMock },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MutationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with mutations and categories', (done) => {
        component.enrichedMutations$.subscribe(enrichedMutations => {
            expect(enrichedMutations.length).toBe(2);
            expect(enrichedMutations[0].categoryName).toBe('Category 1');
            expect(enrichedMutations[1].categoryName).toBe('Category 2');
            done();
        });
    });

    it('should filter mutations by selected category', () => {
        component.selectedCategories.add('cat1');
        const filteredMutations = component.filterMutations([
            {
                id: '1',
                title: 'Test Mutation 1',
                amount: 100,
                date: Timestamp.fromDate(new Date()),
                person: 'User 1',
                projectId: 'project1',
                categoryId: 'cat1',
            } as Mutation,
            {
                id: '2',
                title: 'Test Mutation 2',
                amount: 200,
                date: Timestamp.fromDate(new Date()),
                person: 'User 2',
                projectId: 'project1',
                categoryId: 'cat2',
            } as Mutation,
        ]);
        expect(filteredMutations.length).toBe(1);
        expect(filteredMutations[0].title).toBe('Test Mutation 1');
    });

    it('should sort mutations by date descending', () => {
        const sortedMutations = component.filterMutations([
            {
                id: '1',
                title: 'Test Mutation 1',
                amount: 100,
                date: Timestamp.fromDate(new Date('2023-01-01')),
                person: 'User 1',
                projectId: 'project1',
                categoryId: 'cat1',
            } as Mutation,
            {
                id: '2',
                title: 'Test Mutation 2',
                amount: 200,
                date: Timestamp.fromDate(new Date('2023-02-01')),
                person: 'User 2',
                projectId: 'project1',
                categoryId: 'cat2',
            } as Mutation,
        ]);
        expect(sortedMutations[0].title).toBe('Test Mutation 2');
        expect(sortedMutations[1].title).toBe('Test Mutation 1');
    });

    it('should return unique months from mutations', () => {
        const months = component.getUniqueMonths([
            {
                id: '1',
                title: 'Test Mutation 1',
                amount: 100,
                date: Timestamp.fromDate(new Date('2023-01-01')),
                person: 'User 1',
                projectId: 'project1',
                categoryId: 'cat1',
            } as Mutation,
            {
                id: '2',
                title: 'Test Mutation 2',
                amount: 200,
                date: Timestamp.fromDate(new Date('2023-02-01')),
                person: 'User 2',
                projectId: 'project1',
                categoryId: 'cat2',
            } as Mutation,
        ]);
        expect(months.length).toBe(2);
        expect(months).toContain('January 2023');
        expect(months).toContain('February 2023');
    });
});
