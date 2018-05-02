import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
import {of} from 'rxjs/observable/of';
import {User, UserModel} from '../../models/User';
import database from 'firebase/database';
import app from "firebase/app";


@Injectable()
export class UserService {


  //This should not be here.
  config = {
    apiKey: 'AIzaSyD6QcSARwORPKz_E8ys-yyWtCkyeZCYdsA',
    authDomain: 'cst438-project-80304.firebaseapp.com',
    databaseURL: 'https://cst438-project-80304.firebaseio.com',
    projectId: 'gs://cst438-project-80304.appspot.com/',
    storageBucket: 'gs://cst438-project-80304.appspot.com/',
    messagingSenderId: '351856084400'
  };

  private app: app;
  private database: database;

  //There's a getter and a setter here. Why is this private?
  private user: User;

  public currentUser(): User | null {

    //this is a strange dependency...

    if (firebase.auth().currentUser != null) {
      return this.user;
    } else {
      return null;
    }
  }

  public setUser(user) {
    this.user = user;
  }

  //user coords appears to be set only, and doesn't appear to be accesed from anywhere.
  private userCoords: { lat: number, lng: number };

  public setUserCoords(coords) {
    this.userCoords = coords;
  }

  constructor() {
    //initialize firebase reference
    this.app = firebase.initializeApp(this.config);
    this.database = firebase.database();

    this.user = UserModel.nullUser();

    this.downloadUser();

    this.userCoords = {
      lat: 0,
      lng: 0
    };


  }


  //These seem better suited to their specific services...

  insertLocation(data) {
    const newLocationRef = this.database.ref('/locations').push();
    const id = newLocationRef.key;
    data.id = id;
    newLocationRef.set(data);
  }

  insertMatch(match, location) {
    let newMatchRef = this.database.ref('/matches').push();
    let matchId = newMatchRef.key;
    match.id = matchId;
    newMatchRef.set(match);

    let newLocationRef = this.database.ref('/locations').push();
    let locId = newLocationRef.key;
    location.id = locId;
    location.matchId = matchId;
    newLocationRef.set(location);
  }

  //This appears to set up a subscription to the auth-changed event, not trigger
  //an auth change as the method name suggests. This may cause errors if
  //the auth state changes unexpectedly.
  downloadUser() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.user = UserModel.fromFirebaseUser(user);
      }
    });
  }

  //This should be a getter

  public isLoggedIn(): boolean {
    const user = firebase.auth().currentUser;
    if (user != null) {
      return true;
    } else {
      return false;
    }
  }

  //Should turn these into promises instead of taking callbacks.

  signInUser(email, password, callback) {
    console.log(`logging in ${email}...`);
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.user = UserModel.fromFirebaseUser(user);
        return callback(null, this.user);
      })
      .catch((error) => {
        return callback(error, null);
      });
  }

  registerUser(email, password, username, callback) {

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const currUser = firebase.auth().currentUser;
        if (currUser != null) {
          this.user = UserModel.fromFirebaseUser(user);
          currUser.updateProfile({
            displayName: username,
            photoURL: ''
          }).then(() => {
            this.user.displayName = username;
            callback(null, this.user);

          }).catch((error) => {
            callback(error, null);
          });
        }
      })
      .catch((error) => {
        console.log('error registering user');
        callback(error, null);
      });
  }


  logoutUser(callback) {
    firebase.auth().signOut()
      .then(() => {
        this.user = UserModel.nullUser();
        callback(null, true);
      }).catch((error) => {
      callback(error, null);
    });
  }


}
