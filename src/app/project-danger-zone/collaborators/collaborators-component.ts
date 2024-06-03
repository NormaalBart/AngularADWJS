import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorFieldComponent } from '../../error-field/error-field.component';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { LoadingbuttonComponent } from '../../loadingbutton/loadingbutton.component';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Project } from '../../models/project.interface';
import { InviteService } from '../../services/invite.service';
import { MessageService } from '../../services/mesasge.service';
import { MessageType } from '../../models/message.interface';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-project-danger-zone-collaborators',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoadingbuttonComponent, ErrorFieldComponent],
  templateUrl: './collaborators-component.html',
})
export class CollaboratorsComponent implements OnInit {

  formBuilder = inject(FormBuilder);
  projectService = inject(ProjectService);
  inviteService = inject(InviteService);
  messageService = inject(MessageService);
  authService = inject(AuthService);
  userService = inject(UserService);

  currentProject$ = this.projectService.activeProject$;
  currentUser$ = this.authService.currentUser$;

  private userSubject = new BehaviorSubject<User[]>([]);
  users$ = this.userSubject.asObservable();

  @Output() inviteForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  @Output() deleteForm = this.formBuilder.group({});

  ngOnInit() {
    this.projectService.activeProject$.subscribe(project => {
      this.userService.getUsersByIds(project?.access ?? []).subscribe(users => {
        this.userSubject.next(users);
      });
    });
  }

  inviteUser(currentProject: Project): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const { email } = this.inviteForm.value;
      this.userService.getUserByEmail(email!).then(user => {
        if (user) {
          this.inviteService.isUserInvited(currentProject.id, user.id).then(isInvited => {
            if (!isInvited) {
              this.inviteService.inviteUser(currentProject, user).then(() => {
                this.messageService.addMessage({
                  type: MessageType.Success, translateKey: 'collaborators.invite', params: { collaborator: user.displayName }
                });
                resolve();
              });
            } else {
              this.messageService.addMessage({ type: MessageType.Warning, translateKey: 'collaborators.already-invited', params: { collaborator: user.displayName } });
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    });
  }

  deleteUser(project: Project, user: User): Promise<void> {
    return new Promise<void>(async (resolve) => {
      this.projectService.removeUser(project.id, user.id).then(() => {
        this.messageService.addMessage({ type: MessageType.Success, translateKey: 'collaborators.remove', params: { collaborator: user.displayName } });
        resolve();
      });
    });
  }
}
