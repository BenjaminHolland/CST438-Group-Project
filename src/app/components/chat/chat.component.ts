import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat/chat.service';
import {FormControl} from '@angular/forms';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {Message} from '../../models/Message';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
/*
Chat Component
Encapsulates the chat box. Provides auto-scrolling capabilities and chat history.
 */
export class ChatComponent implements OnInit {

  public messages: Message[] = [];
  public newMessage: FormControl = new FormControl();

  @ViewChild('chat', {read: ElementRef}) private chatLog: ElementRef;

  //Added this to prepare for intercepting user-generated scroll events,
  //with the intention of automatically controlling the auto-scroll feature.
  @ViewChild('chat', {read: CdkScrollable}) private chatScrollable: CdkScrollable;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {

    this.chatService
      .onMessage()
      .subscribe(msg => {
        this.messages.push(msg);
        this.scrollToBottom();
      });

  }

  scrollToBottom(): void {

    //This animates the scrolling rather than simply jumping to the next position.
    this.chatLog.nativeElement.scrollTo({left: 0, top: this.chatLog.nativeElement.scrollHeight, behavior: 'smooth'});
  }


  submitMessage(): void {
    this.chatService.sendMessage(this.newMessage.value);
    this.newMessage.setValue('');
  }

}
