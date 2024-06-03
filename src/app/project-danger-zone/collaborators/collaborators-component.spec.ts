import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { InviteService } from '../../services/invite.service';
import { Project } from '../../models/project.interface';
import { User } from '../../models/user.class';
import { MessageType } from '../../models/message.interface';
import { CollaboratorsComponent } from './collaborators-component';
import { MessageService } from '../../services/mesasge.service';

describe('CollaboratorsComponent', () => {
    let component: CollaboratorsComponent;
    let projectServiceMock: any;
    let authServiceMock: any;
    let userServiceMock: any;
    let inviteServiceMock: any;
    let messageServiceMock: any;

    beforeEach(async () => {
        projectServiceMock = jasmine.createSpyObj('ProjectService', ['activeProject$', 'removeUser']);
        projectServiceMock.activeProject$ = of({ id: 'projectId', access: ['userId1', 'userId2'] });
        projectServiceMock.removeUser.and.returnValue(Promise.resolve());

        authServiceMock = jasmine.createSpyObj('AuthService', ['currentUser$']);
        authServiceMock.currentUser$ = of({ id: 'currentUserId' });

        userServiceMock = jasmine.createSpyObj('UserService', ['getUsersByIds', 'getUserByEmail']);
        userServiceMock.getUsersByIds.and.returnValue(of([{ id: 'userId1' }, { id: 'userId2' }]));
        userServiceMock.getUserByEmail.and.returnValue(Promise.resolve({ id: 'userId3', displayName: 'User Three' }));

        inviteServiceMock = jasmine.createSpyObj('InviteService', ['isUserInvited', 'inviteUser']);
        inviteServiceMock.isUserInvited.and.returnValue(Promise.resolve(false));
        inviteServiceMock.inviteUser.and.returnValue(Promise.resolve());

        messageServiceMock = jasmine.createSpyObj('MessageService', ['addMessage']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, TranslateModule.forRoot(), CollaboratorsComponent],
            providers: [
                FormBuilder,
                { provide: ProjectService, useValue: projectServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: UserService, useValue: userServiceMock },
                { provide: InviteService, useValue: inviteServiceMock },
                { provide: MessageService, useValue: messageServiceMock },
            ]
        }).compileComponents();

        const fixture = TestBed.createComponent(CollaboratorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize users on project change', (done) => {
        component.users$.subscribe(users => {
            expect(users.length).toBe(2);
            done();
        });
    });

    it('should invite a user', async () => {
        component.inviteForm.setValue({ email: 'test@example.com' });
        await component.inviteUser({ id: 'projectId' } as Project);

        expect(userServiceMock.getUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(inviteServiceMock.isUserInvited).toHaveBeenCalledWith('projectId', 'userId3');
        expect(inviteServiceMock.inviteUser).toHaveBeenCalledWith({ id: 'projectId' } as Project, { id: 'userId3', displayName: 'User Three' });
        expect(messageServiceMock.addMessage).toHaveBeenCalledWith({
            type: MessageType.Success,
            translateKey: 'collaborators.invite',
            params: { collaborator: 'User Three' }
        });
    });

    it('should not invite a user if already invited', async () => {
        inviteServiceMock.isUserInvited.and.returnValue(Promise.resolve(true));
        component.inviteForm.setValue({ email: 'test@example.com' });
        await component.inviteUser({ id: 'projectId' } as Project);

        expect(userServiceMock.getUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(inviteServiceMock.isUserInvited).toHaveBeenCalledWith('projectId', 'userId3');
        expect(inviteServiceMock.inviteUser).not.toHaveBeenCalled();
        expect(messageServiceMock.addMessage).toHaveBeenCalledWith({
            type: MessageType.Warning,
            translateKey: 'collaborators.already-invited',
            params: { collaborator: 'User Three' }
        });
    });

    it('should delete a user', async () => {
        await component.deleteUser({ id: 'projectId' } as Project, { id: 'userId1', displayName: 'User One' } as User);

        expect(projectServiceMock.removeUser).toHaveBeenCalledWith('projectId', 'userId1');
        expect(messageServiceMock.addMessage).toHaveBeenCalledWith({
            type: MessageType.Success,
            translateKey: 'collaborators.remove',
            params: { collaborator: 'User One' }
        });
    });
});
