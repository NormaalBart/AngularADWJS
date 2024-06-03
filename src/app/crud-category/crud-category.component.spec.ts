import { TestBed } from '@angular/core/testing';
import { CrudCategoryComponent } from './crud-category.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from '../services/mesasge.service';
import { CategoryService } from '../services/categories.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Category } from '../models/category.interface';
import { Timestamp } from '@angular/fire/firestore';

describe('CrudCategoryComponent', () => {
    let component: CrudCategoryComponent;
    let fixture: any;
    let categoryServiceMock: any;
    let messageServiceMock: any;
    let authServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {
        categoryServiceMock = jasmine.createSpyObj('CategoryService', ['addCategory', 'updateCategory', 'deleteCategory']);
        categoryServiceMock.addCategory.and.returnValue(Promise.resolve());
        categoryServiceMock.updateCategory.and.returnValue(Promise.resolve());
        categoryServiceMock.deleteCategory.and.returnValue(Promise.resolve());

        messageServiceMock = jasmine.createSpyObj('MessageService', ['addMessage']);
        authServiceMock = jasmine.createSpyObj('AuthService', ['currentUser$']);
        authServiceMock.currentUser$ = of({ id: 'currentUserId' });

        routerMock = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                TranslateModule.forRoot(),
                CrudCategoryComponent, // Voeg het standalone component toe aan de imports array
            ],
            providers: [
                FormBuilder,
                { provide: CategoryService, useValue: categoryServiceMock },
                { provide: MessageService, useValue: messageServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CrudCategoryComponent);
        component = fixture.componentInstance;
        component.projectId = 'project1'; // Zorg ervoor dat projectId altijd een waarde heeft
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with empty values when no category is selected', () => {
        component.selectedCategory = undefined;
        component.ngOnChanges({ selectedCategory: { currentValue: undefined, previousValue: undefined, firstChange: true, isFirstChange: () => true } });
        expect(component.categoryForm.value).toEqual({ categoryName: '', maxBudget: '', endDate: '' });
    });

    it('should initialize the form with selected category values', () => {
        const selectedCategory: Category = {
            id: 'cat1',
            name: 'Category 1',
            projectId: 'project1',
            maxBudget: 500,
            endDate: Timestamp.fromDate(new Date('2023-12-31'))
        };
        component.selectedCategory = selectedCategory;
        component.ngOnChanges({ selectedCategory: { currentValue: selectedCategory, previousValue: undefined, firstChange: true, isFirstChange: () => true } });

        expect(component.categoryForm.value).toEqual({
            categoryName: 'Category 1',
            maxBudget: '500',
            endDate: '2023-12-31'
        });
    });

    it('should reset the form when modal is closed', () => {
        component.categoryForm.setValue({ categoryName: 'Category 1', maxBudget: '500', endDate: '2023-12-31' });
        component.closeModal();
        expect(component.categoryForm.value).toEqual({ categoryName: '', maxBudget: '', endDate: '' });
    });

    it('should call addCategory when submitting a new category', async () => {
        component.selectedCategory = {} as Category;
        component.categoryForm.setValue({ categoryName: 'Category 1', maxBudget: '500', endDate: '2023-12-31' });

        await component.submitForm();

        expect(categoryServiceMock.addCategory).toHaveBeenCalled();
        expect(categoryServiceMock.updateCategory).not.toHaveBeenCalled();
    });

    it('should call updateCategory when submitting an existing category', async () => {
        const selectedCategory: Category = {
            id: 'cat1',
            name: 'Category 1',
            projectId: 'project1',
            maxBudget: 500,
            endDate: Timestamp.fromDate(new Date('2023-12-31'))
        };
        component.selectedCategory = selectedCategory;
        component.categoryForm.setValue({ categoryName: 'Category 1', maxBudget: '500', endDate: '2023-12-31' });

        await component.submitForm();

        expect(categoryServiceMock.updateCategory).toHaveBeenCalled();
        expect(categoryServiceMock.addCategory).not.toHaveBeenCalled();
    });

    it('should call deleteCategory when deleting a category', async () => {
        const selectedCategory: Category = {
            id: 'cat1',
            name: 'Category 1',
            projectId: 'project1',
            maxBudget: 500,
            endDate: Timestamp.fromDate(new Date('2023-12-31'))
        };
        component.selectedCategory = selectedCategory;

        await component.deleteCategory();

        expect(categoryServiceMock.deleteCategory).toHaveBeenCalledWith(selectedCategory);
    });
});
