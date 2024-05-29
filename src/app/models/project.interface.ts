import { InviteInterface } from "./invite.interface";

export class Project {
  id: string;
  name: string;
  ownerId: string;
  access: string[];
  archived: boolean;
  invites: InviteInterface[];

  constructor(id: string, name: string, ownerId: string, access: string[], archived: boolean, invites: InviteInterface[] = []) {
    this.id = id;
    this.name = name;
    this.ownerId = ownerId;
    this.access = access;
    this.archived = archived;
    this.invites = invites;
  }
}
