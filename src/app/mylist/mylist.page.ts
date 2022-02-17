import { Component, NgIterable, OnInit } from '@angular/core';
import { SessionStorageService, StorageChangeAction } from '../app-global-services/session-storage.service';
import { FirebaseService } from '../app-global-services/firebase.service';
import { Router } from '@angular/router';import { DrawerService } from '../services/drawer.service';


@Component({
  selector: 'mylist-page',
  templateUrl: 'mylist.page.html',
  styleUrls: ['mylist.page.scss']
})
export class MyListPage implements OnInit {
  pageTitle = 'My List';
  isLoggedIn: boolean;
  // currentUserID: string;
  userMovieList: any | void;
  // drawerService: any;

  constructor(
    private storageService: SessionStorageService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoggedInLogic();
    this.getUserMovies();
  }
  
  private isLoggedInLogic() {
    this.isLoggedIn = this.storageService.read('isAuthed') ? true : false;
    this.storageService.getObservableStorageChanges().subscribe((changeAction:StorageChangeAction) => {
      const {type, key, value} = changeAction;
      if(key === 'isAuthed' && value === true ){ this.isLoggedIn = value ? true : false }
      if(key === 'userCollection' && type === 'write'){ 
        // this.userMovieList = this.storageService.read('userCollection');
        this.getUserMovies();
      };
    });
  }

  private sortBy(arr: any[] | void, prop: string) {
    if(!arr){return}
    arr.sort( (a, b) => {
      if (a[prop] < b[prop]) {return -1}
      else if (a[prop] > b[prop]) {return 1}
      else {return 0}
    });
  }

  private async getUserMovies() {
    const cachedUserCollection = await this.storageService.read('userCollection');
    if (cachedUserCollection){
      this.userMovieList = cachedUserCollection;
      this.sortBy(this.userMovieList,'title');
      console.log('loaded collection from storage');
    }else {
      const freshUserCollection = await this.firebaseService.readUserCollection();
      this.userMovieList = freshUserCollection;
      this.sortBy(this.userMovieList, 'title');
      console.log('loaded collection from firebase');
    }
  }

  public removeMovie(movieID:number) {
    this.firebaseService.getCurrentUser().then( user => {
      const uID = user.uid;
      this.storageService.remove('userCollection');
      this.firebaseService.removeFromCollection(uID, `${movieID}`);
      this.getUserMovies();
    });
  }

  public saveCustomData(movieID:number, movieData: any, customData:any) {
    this.firebaseService.getCurrentUser().then( user => {
      const uID = user.uid;
      this.storageService.remove('userCollection');
      this.firebaseService.saveCustomData(uID, `${movieID}`, movieData, customData);
      this.getUserMovies();
    });
  }

  public goToDetails(id: string) {
    let userCollection = this.storageService.read('userCollection');
    let found: boolean = userCollection.some(movie=> movie.id === id);
    this.router.navigate(['tabs','movies','details',`${id}`], {state: {isFound:found} });
  }

  toggleHidden(id:any){
    document.getElementById(id).classList.toggle('hidden')
  }

  
}
