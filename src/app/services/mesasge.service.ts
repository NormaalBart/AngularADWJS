// message.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message.interface';
import { environment } from '../../environments/global';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  addMessage(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
    setTimeout(() => this.removeMessage(message), environment.messageTime);
  }

  private removeMessage(messageToRemove: Message): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = currentMessages.filter(message => message !== messageToRemove);
    this.messagesSubject.next(updatedMessages);
  }
}
