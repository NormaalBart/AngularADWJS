import { Component, OnInit, inject } from '@angular/core';
import { MessageInterface } from '../models/message.interface';
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

  messages: MessageInterface[] = [];

  ngOnInit() {
    this.messageService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }
}