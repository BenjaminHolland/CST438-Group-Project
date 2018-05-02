import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user-service/user.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.css']
})
export class AppBarComponent implements OnInit {
  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  get currentUser(): string {
    return this.userService.currentUser().displayName;
  }

  constructor(private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl('/' + path);
  }

  logout() {
    this.userService.logoutUser((err, res) => {
      if (err != null) {
        console.log(err.message);
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

}
