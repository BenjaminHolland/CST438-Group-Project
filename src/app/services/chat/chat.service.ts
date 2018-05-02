import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../user-service/user.service';
import {environment} from "../../../environments/environment";

export interface Message {
  message: string;
  username: string;
}

@Injectable()
export class ChatService {


  private socket: SocketIOClient.Socket = null;

  constructor(private userService: UserService) {
    console.log('in constructor');
    this.socket = io.connect(`https://${environment.domain}:3000`);
  }


  sendMessage(message: string) {
    const msg = {
      message: message,
      username: this.userService.getUser().displayName
    };
    this.socket.emit('message', msg);
  }


  onMessage() {
    return Observable.create(observer => {
      this.socket.on('serverMessage', msg => {
        observer.next(msg);
      })
    })
  }

}
