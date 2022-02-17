import { Component, OnInit, Input } from '@angular/core';
import { MovieService } from '../../services/api.service';
import { PosterSize } from '../../models/enums'
import { Router, NavigationExtras, NavigationBehaviorOptions } from '@angular/router';
import { SessionStorageService, StorageChangeAction } from '../../app-global-services/session-storage.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  isLoggedIn: boolean;

  @Input() config: any;
  @Input() id: number;
  @Input() title: number;
  @Input() release: string;
  @Input() popularity: number;

  public imgUrl: string;

  constructor(
    private router: Router,
    private api: MovieService,
    private storageService: SessionStorageService
  ) { this.imgUrl = '' }

  ngOnInit() {
    this.isLoggedInLogic();
    if (this.id) {
      this.api.getImages(this.id).subscribe(
        (images: any) => {
          if (images['posters'].length) {
            const path: string = images.posters[0].file_path;
            this.imgUrl = `${this.config['images'].secure_base_url}/${this.config['images'].poster_sizes[PosterSize.SML]}${path}`;
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
  }

  private isLoggedInLogic() {
    this.isLoggedIn = this.storageService.read('isAuthed') ? true : false;
    this.storageService.getObservableStorageChanges().subscribe((changeAction:StorageChangeAction) => {
      const {type, key, value} = changeAction;
      if(key === 'isAuthed' && value === true ){ this.isLoggedIn = value ? true : false }
    });
  }

  goToDetailsNotLoggedIn(id: any) {
    this.router.navigate(['tabs','movies','details',`${id}`]);
  }

  goToDetails(id: any) {
    let userCollection = this.storageService.read('userCollection');
    let found: boolean = userCollection.some(movie=> movie.id === id);
    this.router.navigate(['tabs','movies','details',`${id}`], {state: {isFound:found} });
  }

}
