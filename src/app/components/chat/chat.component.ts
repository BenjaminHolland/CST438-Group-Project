import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat/chat.service';
import {FormControl} from "@angular/forms";
import {environment} from "../../../environments/environment";
import * as moment from 'moment'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public messages: any[];
  newMessage: FormControl;

  constructor(private chatService: ChatService) {
    this.messages = [];
    this.newMessage = new FormControl();


  }

  private chatLog: HTMLElement | null = null;

  ngOnInit() {

    this.chatService
      .onMessage()
      .subscribe(msg => {
        this.messages.push(msg);
      });
    this.chatLog = document.getElementById('chat');
  }


  //scrolls chat to bottom of div
  scrollToBottom(): void {
    this.chatLog.scrollTop = this.chatLog.scrollHeight + 20;
  }


  //decides if enough messages are in char to need to scroll
  chatShouldScroll(): boolean {
    return this.chatLog.scrollTop + this.chatLog.clientHeight === this.chatLog.scrollHeight;
  }

  submitMessage(): void {

    //send message to server
    this.chatService.sendMessage(this.newMessage.value);

    //scroll chat down
    if (this.chatShouldScroll) {
      this.scrollToBottom();
    }

    //reset message input
    this.newMessage.setValue('');

  }

}
