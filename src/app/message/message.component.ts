import { Component, OnInit, inject } from '@angular/core';
import { Message } from '../models/message.interface';
import { MessageService } from '../services/mesasge.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './message.component.html',
})
export class MessageComponent implements OnInit {

  messageService = inject(MessageService);

  messages: Message[] = [];

  ngOnInit() {
    this.messageService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }
}