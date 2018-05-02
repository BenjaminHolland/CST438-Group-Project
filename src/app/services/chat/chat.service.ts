import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../user-service/user.service';
import {environment} from "../../../environments/environment";
import {Message, MessageModel} from "../../models/Message";


@Injectable()
export class ChatService {

  private socket: SocketIOClient.Socket = io.connect(environment.chatUrl);

  constructor(private userService: UserService) {
  }

  sendMessage(message: string): void {
    this.socket.emit('message', new MessageModel(message, this.userService.currentUser().displayName));
  }

  onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('serverMessage', msg => {
        observer.next(msg);
      });
    });
  }

}
