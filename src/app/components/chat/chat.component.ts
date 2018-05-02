import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat/chat.service';
import {FormControl} from "@angular/forms";
import {environment} from "../../../environments/environment";
import * as moment from 'moment'
import {Message} from "../../models/Message";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  public messages: Message[];
  newMessage: FormControl;

  constructor(private chatService: ChatService) {
    this.messages = [];
    this.newMessage = new FormControl();


  }

  @ViewChild('chat', { read: ElementRef }) private chatLog: ElementRef;

  ngOnInit() {

    this.chatService
      .onMessage()
      .subscribe(msg => {
        this.messages.push(msg);
        this.scrollToBottom();
      });

  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  //scrolls chat to bottom of div
  scrollToBottom(): void {
    this.chatLog.nativeElement.scrollTo({left: 0 , top: this.chatLog.nativeElement.scrollHeight, behavior: 'smooth'});
  }


  //decides if enough messages are in char to need to scroll
  chatShouldScroll(): boolean {
    return this.chatLog.nativeElement.scrollTop + this.chatLog.nativeElement.clientHeight === this.chatLog.nativeElement.scrollHeight;
  }

  submitMessage(): void {

    //send message to server
    this.chatService.sendMessage(this.newMessage.value);

    //scroll chat down

   this.scrollToBottom();
    //reset message input
    this.newMessage.setValue('');

  }

}
