import { TestBed } from '@angular/core/testing';
import { CreateProjectComponent } from './create-project.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../services/project.service';
import { MessageService } from '../services/mesasge.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { pathNames } from '../../environments/global';
import { MessageType } from '../models/message.interface';

describe('CreateProjectComponent', () => {
    let component: CreateProjectComponent;
    let fixture: any;
    let projectServiceMock: any;
    let messageServiceMock: any;
    let authServiceMock: any;
    let routerMock: any;

    beforeEach(async () => {
        projectServiceMock = jasmine.createSpyObj('ProjectService', ['addProject']);
        projectServiceMock.addProject.and.returnValue(of('new-project-id'));

        messageServiceMock = jasmine.createSpyObj('MessageService', ['addMessage']);
        authServiceMock = jasmine.createSpyObj('AuthService', ['currentUser$']);
        authServiceMock.currentUser$ = of({ id: 'currentUserId' });

        routerMock = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                TranslateModule.forRoot(),
                CreateProjectComponent // Voeg het standalone component toe aan de imports array
            ],
            providers: [
                FormBuilder,
                { provide: ProjectService, useValue: projectServiceMock },
                { provide: MessageService, useValue: messageServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateProjectComponent);
        component = fixture.componentInstance;
        component.showModal = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with empty values', () => {
        expect(component.createProjectForm.value).toEqual({ projectName: '' });
    });

    it('should not call addProject if the form is invalid', async () => {
        component.createProjectForm.setValue({ projectName: '' });
        await component.addProject('currentUserId');
        expect(projectServiceMock.addProject).not.toHaveBeenCalled();
    });

    it('should call addProject if the form is valid', async () => {
        component.createProjectForm.setValue({ projectName: 'New Project' });
        await component.addProject('currentUserId');

        expect(projectServiceMock.addProject).toHaveBeenCalledWith('currentUserId', 'New Project');
        expect(messageServiceMock.addMessage).toHaveBeenCalledWith({
            type: MessageType.Success,
            translateKey: 'project.created',
            params: { projectName: 'New Project' }
        });
        expect(routerMock.navigate).toHaveBeenCalledWith([pathNames.projects.mutations('new-project-id')]);
    });

    it('should reset the form and close the modal when closing the modal', () => {
        component.createProjectForm.setValue({ projectName: 'New Project' });
        component.showModal = true;
        component.closeModal();

        expect(component.createProjectForm.value).toEqual({ projectName: '' });
        expect(component.showModal).toBe(false);
    });
});
