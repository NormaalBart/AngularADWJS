import { Timestamp } from "@angular/fire/firestore";

export interface Mutation {
    id?: string;
    title: string;
    amount: number;
    date: Timestamp;
    person: string;
    projectId: string;
  }