import { TestBed } from '@angular/core/testing';
import { ProjectSidebarComponent } from './project-sidebar.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { LoadingbuttonComponent } from '../loadingbutton/loadingbutton.component';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ProjectService } from '../services/project.service';
import { AuthService } from '../services/auth.service';
import { InviteService } from '../services/invite.service';
import { of } from 'rxjs';
import { Project } from '../models/project.interface';
import { InviteInterface } from '../models/invite.interface';
import { pathNames } from '../../environments/global';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProjectSidebarComponent', () => {
    let component: ProjectSidebarComponent;
    let fixture: any;
    let projectServiceMock: any;
    let authServiceMock: any;
    let inviteServiceMock: any;
    let router: Router;

    beforeEach(async () => {
        projectServiceMock = jasmine.createSpyObj('ProjectService', ['projects$', 'activeProject$', 'setActiveProject', 'isActiveProject']);
        projectServiceMock.projects$ = of([
            { id: 'project1', name: 'Project 1', archived: false } as Project,
            { id: 'project2', name: 'Project 2', archived: true } as Project
        ]);
        projectServiceMock.activeProject$ = of({ id: 'project1', name: 'Project 1', archived: false } as Project);
        projectServiceMock.isActiveProject.and.returnValue(true);

        authServiceMock = jasmine.createSpyObj('AuthService', ['currentUser$']);
        authServiceMock.currentUser$ = of({ id: 'currentUserId' });

        inviteServiceMock = jasmine.createSpyObj('InviteService', ['acceptInvite', 'rejectInvite']);
        inviteServiceMock.acceptInvite.and.returnValue(Promise.resolve());
        inviteServiceMock.rejectInvite.and.returnValue(Promise.resolve());

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                CreateProjectComponent,
                LoadingbuttonComponent,
                ProjectSidebarComponent // Voeg het standalone component toe aan de imports array
            ],
            providers: [
                FormBuilder,
                { provide: ProjectService, useValue: projectServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: InviteService, useValue: inviteServiceMock },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProjectSidebarComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to project', () => {
        spyOn(router, 'navigate');
        const project: Project = { id: 'project1', name: 'Project 1', archived: false, ownerId: 'ownerid', access: ['ownerid'], invites: [] };
        component.navigateToProject(project);
        expect(router.navigate).toHaveBeenCalledWith([pathNames.projects.projectOverview(project.id)]);
        expect(projectServiceMock.setActiveProject).toHaveBeenCalledWith(project);
    });

    it('should check if a project is active', () => {
        const project: Project = { id: 'project1', name: 'Project 1', archived: false, ownerId: 'ownerid', access: ['ownerid'], invites: [] };
        expect(component.isActiveProject(project)).toBe(true);
        expect(projectServiceMock.isActiveProject).toHaveBeenCalledWith(project);
    });

    it('should check if a route is active', () => {
        spyOnProperty(router, 'url', 'get').and.returnValue('/projects/project1');
        expect(component.isActiveRoute('/projects/project1')).toBe(true);
        expect(component.isActiveRoute('/projects/project2')).toBe(false);
    });

    it('should change the filter and update filtered projects', () => {
        const event = { target: { value: 'archived' } } as unknown as Event;
        component.onFilterChange(event);
        component.filteredProjects$.subscribe(projects => {
            expect(projects.length).toBe(1);
            expect(projects[0].id).toBe('project2');
        });
    });

    it('should accept invite', async () => {
        const invite: InviteInterface = { id: 'invite1', projectId: 'project1' } as InviteInterface;
        await component.acceptInvite(invite);
        expect(inviteServiceMock.acceptInvite).toHaveBeenCalledWith(invite);
    });

    it('should reject invite', async () => {
        const invite: InviteInterface = { id: 'invite1', projectId: 'project1' } as InviteInterface;
        await component.rejectInvite(invite);
        expect(inviteServiceMock.rejectInvite).toHaveBeenCalledWith(invite);
    });
});
