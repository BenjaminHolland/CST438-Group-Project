import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../user-service/user.service';
import {environment} from "../../../environments/environment";
import {MessageModel} from "../../models/Message";

export interface Message {
  message: string;
  username: string;
}

@Injectable()
export class ChatService {

  private socket: SocketIOClient.Socket = io.connect(`https://${environment.domain}`);

  constructor(private userService: UserService) {
  }

  sendMessage(message: string): void {
    this.socket.emit('message', new MessageModel(message, this.userService.getUser().displayName));
  }

  onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('serverMessage', msg => {
        observer.next(msg);
      });
    });
  }

}
