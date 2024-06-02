import { Timestamp } from "@angular/fire/firestore";

export interface Category {
    id?: string;
    name: string;
    maxBudget: number;
    endDate: Timestamp | null;
    projectId: string;
}