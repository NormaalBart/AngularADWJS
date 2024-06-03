import { Injectable, OnInit, Query, inject } from '@angular/core'
import { BehaviorSubject, Observable, from, of } from 'rxjs'
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { RegisterInterface } from '../models/register.interface';
import { LoginInterface } from '../models/login.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { firebaseTables } from '../../environments/global';
import { AuthService } from './auth.service';
import { User } from '../models/user.class';
import { InviteInterface } from '../models/invite.interface';
import { Project } from '../models/project.interface';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  private firestore = inject(Firestore);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  private invitesCollection = collection(this.firestore, firebaseTables.invites);

  constructor() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.getInvitesForUser(user.id).subscribe(invites => {
          user.setInvites(invites);
        });
      }
    });
  }

  inviteUser(project: Project, user: User): Promise<void> {
    const inviteId = `${project.id}_${user.id}`;
    const inviteDocRef = doc(this.invitesCollection, inviteId);
    return setDoc(inviteDocRef, {
      projectName: project.name,
      projectId: project.id,
      userId: user.id
    });
  }

  async isUserInvited(projectId: string, userId: string): Promise<boolean> {
    const invitesQuery = query(this.invitesCollection, where('projectId', '==', projectId), where('userId', '==', userId));
    const inviteSnapshot = await getDocs(invitesQuery);
    return !inviteSnapshot.empty;
  }

  getInvitesForUser(userId: string): Observable<InviteInterface[]> {
    const invitesQuery = query(this.invitesCollection, where('userId', '==', userId));
    return collectionData(invitesQuery, { idField: 'id' }) as Observable<InviteInterface[]>;
  }

  async acceptInvite(invite: InviteInterface): Promise<void> {
    const docRef = doc(this.invitesCollection, invite.id);
    return this.projectService.addUser(invite.projectId, invite.userId).then(() => {
      return deleteDoc(docRef);
    });
  }

  rejectInvite(invite: InviteInterface): Promise<void> {
    const docRef = doc(this.invitesCollection, invite.id);
    return deleteDoc(docRef);
  }
}
