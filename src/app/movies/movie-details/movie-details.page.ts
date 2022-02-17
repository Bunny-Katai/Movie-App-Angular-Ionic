import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MovieService } from '../../services/api.service';
import { PosterSize } from '../../models/enums';
import { SessionStorageService, StorageChangeAction } from '../../app-global-services/session-storage.service';
import { FirebaseService } from 'src/app/app-global-services/firebase.service';

@Component({
  selector: 'movie-details-page',
  templateUrl: 'movie-details.page.html',
  styleUrls: ['movie-details.page.scss']
})
export class MovieDetailsPage implements OnInit {
  pageTitle: string = 'Loading Details...'
  routeParams: Params
  movieDetails: any
  public imgUrl: string;
  private config: any;
  public liked: boolean;
  isLoggedIn: boolean;
  isFound: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: MovieService,
    private storageService: SessionStorageService,
    private firebaseService: FirebaseService
  ) {
    this.isFound = history.state.isFound;
    this.liked = false; // load from user later
  }

  ngOnInit() {
    this.isLoggedInLogic();
    this.getRouteParams();
    this.getConfig();
    this.getDetails(this.routeParams.id);
    this.getImage(this.routeParams.id);
  }

  isLoggedInLogic() {
    this.isLoggedIn = this.storageService.read('isAuthed') ? true : false;
    this.storageService.getObservableStorageChanges().subscribe((changeAction:StorageChangeAction) => {
      const {type, key, value} = changeAction;
      if(key === 'isAuthed'){ this.isLoggedIn = value ? true : false }
      // if(key === 'userCollection' && type === 'write'){this.isNotInUserListLogic(this.routeParams.id)};
    });
  }


  addMovie(movieID:number, movieData:any){
    this.firebaseService.getCurrentUser().then( user => {
      const uID = user.uid;
      this.firebaseService.writeToCollection(uID, `${movieID}`, movieData);
    });
  }

  getRouteParams() {
    this.activatedRoute.params.subscribe( params => {
      this.routeParams = params;
    });
  }

  getImage(id:number){
    this.api.getImages(id).subscribe(
      (images: any) => {
        if (images['posters'].length) {
          const path: string = images.posters[0].file_path;
          this.imgUrl = `${this.config['images'].secure_base_url}/${this.config['images'].poster_sizes[PosterSize.MED]}${path}`;
        } else {
          this.imgUrl = '../../assets/no_image.jpeg';
        }
      },
      (error: any) => {
        this.imgUrl = '../../assets/no_image.jpeg';
        console.error(error);
      }
    );
  }

  getDetails(id:string) {
    this.pageTitle = 'Loading Details...'
    this.api.getDetails(id).subscribe( data =>{
      if(Number(id) === data.id){
        this.movieDetails = data;
        this.pageTitle = data.title;
      }
    });
  }

  getConfig() {
    this.api.getConfig().subscribe(
      (config: any) => {
        this.config = config;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  public like(): void {
    this.liked = !this.liked;
  }

}