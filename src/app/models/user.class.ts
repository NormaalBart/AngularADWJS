import { BehaviorSubject, Observable } from 'rxjs';
import { InviteInterface } from './invite.interface';

export class User {
  id: string;
  displayName: string;
  email: string;

  private invites = new BehaviorSubject<InviteInterface[]>([]);
  invites$ = this.invites.asObservable();

  constructor(id: string, displayName: string, email: string, invites: InviteInterface[] = []) {
    this.id = id;
    this.displayName = displayName;
    this.email = email;
    this.setInvites(invites);
  }

  setInvites(invites: InviteInterface[]): void {
    this.invites.next(invites);
  }
}
