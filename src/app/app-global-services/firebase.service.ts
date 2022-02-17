import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { Observable, of, ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs';
import { SessionStorageService } from './session-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  // private userMoviesSubject = new ReplaySubject<any>(1);

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private session: SessionStorageService,
    private router: Router
  ) { }

  // getObservableUserMovies(): Observable<any>{
  //   return this.userMoviesSubject.asObservable();
  // }

  getCurrentUser(): Promise<any> {
    return this.auth.currentUser
  }

  getUserDetails(): Observable<any> | null {
    return this.auth.user
  }
  
  createUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err)
        )
    })
  }

  signinNewUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            const uID = res.user.uid;
            this.session.write('currentUserID', uID);
            this.session.write('isAuthed', true);
            this.readUserCollection();
            this.router.navigateByUrl('tabs/movies');
            console.log('Sign In Action. NEW user ID: ', uID);
            resolve(res);
          },
          err => reject(err)
        )
    })
  }

  signinUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            const uID = res.user.uid;
            this.session.write('currentUserID', uID);
            this.session.write('isAuthed', true);
            this.readUserCollection();
            console.log('Sign In Action. user ID: ', uID);
            this.router.navigateByUrl('tabs/mylist');
            resolve(res);
          },
          err => reject(err)
        )
    })
  }

  signoutUser() {
    return new Promise<void>((resolve, reject) => {
      if (this.auth.currentUser) {
        this.auth.signOut()
          .then(() => {
            this.session.remove('currentUserID');
            this.session.remove('isAuthed');
            this.session.remove('userCollection');
            console.log("Sign out Action");
            // window.location.reload();
            resolve();
          }).catch(() => {
            reject();
          });
      }
    })
  }

  // Firestore CRUD Methods

  // create/update
  // adding movie to firebase
  public writeToCollection(uID:string, movieID:string, movieData: any){
    movieData.userComment = '';
    movieData.userRating = 0;
    movieData.userWatched = false;
    
    this.db.collection('users').doc('user-'+uID).collection('movie-list').doc(movieID).set(movieData).then(
      _=>{
        console.log(`success: movie document with id: ${movieID} was written to in collection: users/user-${uID}/movie-list`);
        this.readUserCollection();
        this.router.navigateByUrl('tabs/mylist');
      },
      _=>console.log(`fail: error setting movie document with id: ${movieID} in collection: users/user-${uID}/movie-list`)
    );
  }

  public saveCustomData(uID:string, movieID:string, movieData:any, customData:any) {
    movieData.userComment = customData.userComment;
    movieData.userRating = customData.userRating;
    movieData.userWatched = customData.userWatched;

    this.db.collection('users').doc('user-'+uID).collection('movie-list').doc(movieID).set(movieData).then(
      _=>{
        console.log(`success: movie document with id: ${movieID} saved custom data to in collection: users/user-${uID}/movie-list`);
        this.readUserCollection();
      },
      _=>console.log(`fail: error saving custom data to movie document with id: ${movieID} in collection: users/user-${uID}/movie-list`)
    );
  }

  public async readUserCollection(): Promise<any[] | void> {
    const user = await this.auth.currentUser
    if(!user){return}
    const documentArray = [];
    const stream = this.db.collection('users').doc(`user-${user.uid}`).collection('movie-list').valueChanges();
    const sub = stream.subscribe(docArray=>{
      this.session.write('userCollection', docArray);
      docArray.forEach((doc) => {documentArray.push(doc)});
      sub.unsubscribe();
    });
    
    return documentArray;
  }

  // delete
  public removeFromCollection(uID:string, movieID:string){
    this.db.collection('users').doc('user-'+uID).collection('movie-list').doc(movieID).delete().then(
      _=>console.log(`success: movie document with id: ${movieID} removed from collection: users/user-${uID}/movie-list`),
      _=>console.log(`fail: error removing movie document with id: ${movieID} from collection: users/user-${uID}/movie-list`)
    )
  }


}