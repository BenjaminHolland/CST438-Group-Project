import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat/chat.service';
import {FormControl} from "@angular/forms";
import {environment} from "../../../environments/environment";
import * as moment from 'moment'
import {Message} from "../../models/Message";
import {CdkScrollable, ScrollDispatcher} from "@angular/cdk/scrolling";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  public messages: Message[];
  newMessage: FormControl;

  constructor(private chatService: ChatService, private scrollDispatch: ScrollDispatcher, private zone: NgZone, private changeDetector: ChangeDetectorRef) {
    this.messages = [];
    this.newMessage = new FormControl();


  }

  @ViewChild('chat', {read: ElementRef}) private chatLog: ElementRef;
  private chatLogScrollable: CdkScrollable;
  private shouldScroll: boolean = false;
  @ViewChild('chat', {read: CdkScrollable}) private chatScrollable: CdkScrollable;

  ngOnInit() {
    this.chatScrollable.elementScrolled().subscribe(x => {
      console.log(x);
    });
    this.chatService
      .onMessage()
      .subscribe(msg => {
        this.messages.push(msg);
        this.changeDetector.detectChanges();
        this.shouldScroll=true;
        this.scrollToBottom();
      });

  }

  onScrolled(event): void {
    console.log(event);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  //scrolls chat to bottom of div
  scrollToBottom(): void {
    if (this.shouldScroll) {
      this.chatLog.nativeElement.scrollTo({left: 0, top: this.chatLog.nativeElement.scrollHeight, behavior: 'smooth'});
      this.shouldScroll = false;
    }
  }


  //decides if enough messages are in char to need to scroll
  chatShouldScroll(): boolean {
    return this.chatLog.nativeElement.scrollTop + this.chatLog.nativeElement.clientHeight === this.chatLog.nativeElement.scrollHeight;
  }

  submitMessage(): void {

    //send message to server
    this.chatService.sendMessage(this.newMessage.value);

    //scroll chat down


    //reset message input
    this.newMessage.setValue('');



  }

}
