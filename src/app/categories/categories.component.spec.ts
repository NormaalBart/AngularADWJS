import { TestBed } from '@angular/core/testing';
import { CategoriesComponent } from './categories.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CrudCategoryComponent } from '../crud-category/crud-category.component';
import { ProjectService } from '../services/project.service';
import { CategoryService } from '../services/categories.service';
import { MutationService } from '../services/mutations.service';
import { of } from 'rxjs';
import { Category } from '../models/category.interface';
import { Mutation } from '../models/mutation.interface';
import { emptyCategoryFilter } from '../../environments/global';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Timestamp } from '@angular/fire/firestore';

describe('CategoriesComponent', () => {
    let component: CategoriesComponent;
    let fixture: any;
    let projectServiceMock: any;
    let categoryServiceMock: any;
    let mutationServiceMock: any;

    beforeEach(async () => {
        projectServiceMock = jasmine.createSpyObj('ProjectService', ['activeProject$']);
        projectServiceMock.activeProject$ = of({ id: 'project1' });

        categoryServiceMock = jasmine.createSpyObj('CategoryService', ['categories$']);
        categoryServiceMock.categories$ = of([
            { id: 'cat1', name: 'Category 1', maxBudget: 500, projectId: 'project1' } as Category,
            { id: 'cat2', name: 'Category 2', maxBudget: 1000, projectId: 'project1' } as Category
        ]);

        mutationServiceMock = jasmine.createSpyObj('MutationService', ['updateMutation']);

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                TranslateModule.forRoot(),
                DragDropModule,
                CrudCategoryComponent,
                CategoriesComponent // Voeg het standalone component toe aan de imports array
            ],
            providers: [
                { provide: ProjectService, useValue: projectServiceMock },
                { provide: CategoryService, useValue: categoryServiceMock },
                { provide: MutationService, useValue: mutationServiceMock },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CategoriesComponent);
        component = fixture.componentInstance;
        component.projectId = 'project1';
        component.filterCategories = new Set();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open selected category for editing', () => {
        const category: Category = { id: 'cat1', name: 'Category 1', maxBudget: 500, projectId: 'project1', endDate: Timestamp.fromDate(new Date()) };
        component.openSelectedCategory(category);
        expect(component.selectedCategory).toEqual(category);
    });

    it('should create a new category for the project when no category is selected', () => {
        component.openSelectedCategory(undefined);
        expect(component.selectedCategory).toEqual({ name: '', projectId: 'project1', maxBudget: 0 } as Category);
    });

    it('should check if a category is selected', () => {
        component.filterCategories.add('cat1');
        expect(component.isSelected('cat1')).toBe(true);
        expect(component.isSelected('cat2')).toBe(false);
    });

    it('should toggle category selection', () => {
        const category: Category = { id: 'cat1', name: 'Category 1', maxBudget: 500, projectId: 'project1', endDate: Timestamp.fromDate(new Date()) };
        component.toggleCategorySelection(category);
        expect(component.filterCategories.has('cat1')).toBe(true);
        component.toggleCategorySelection(category);
        expect(component.filterCategories.has('cat1')).toBe(false);
    });

    it('should show empty mutations', () => {
        component.showEmptyMutations();
        expect(component.filterCategories.has(emptyCategoryFilter)).toBe(true);
        component.showEmptyMutations();
        expect(component.filterCategories.has(emptyCategoryFilter)).toBe(false);
    });

    it('should update mutation category on drop', () => {
        const event: CdkDragDrop<Category> = {
            previousIndex: 0,
            currentIndex: 1,
            item: { data: { id: 'mutation1', categoryId: 'cat1' } as Mutation },
            container: { data: { id: 'cat2' } as Category },
            previousContainer: { data: { id: 'cat1' } as Category },
            isPointerOverContainer: true,
            distance: { x: 0, y: 0 }
        } as unknown as CdkDragDrop<Category>;

        component.onDrop(event);
        expect(mutationServiceMock.updateMutation).toHaveBeenCalledWith({ id: 'mutation1', categoryId: 'cat2' } as Mutation);
    });

    it('should update mutation category to null on drop into empty category', () => {
        const event = {
            item: { data: { id: 'mutation1', categoryId: 'cat1' } as Mutation }
        } as CdkDragDrop<Mutation>;

        component.onDropEmptyCategory(event);
        expect(mutationServiceMock.updateMutation).toHaveBeenCalledWith({ id: 'mutation1', categoryId: null } as Mutation);
    });
});
