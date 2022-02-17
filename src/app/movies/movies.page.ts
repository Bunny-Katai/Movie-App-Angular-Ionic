import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/api.service';

@Component({
  selector: 'movies-page',
  templateUrl: 'movies.page.html',
  styleUrls: ['movies.page.scss']
})
export class MoviesPage implements OnInit{

  public pageTitle: string;
  public movieList: Array<any>;
  public config: any;
  public queryText: string;
  public isLoggedIn: boolean;

  constructor(private api: MovieService) {
    this.pageTitle = 'Search Movies';
    this.queryText = '';
    this.isLoggedIn = false;
  }

  ngOnInit(): void {
    this.getInitialMovies();
  }

  private getInitialMovies(){
    this.api.fetchMovies().subscribe(
      (result: any) => { 
        this.movieList = result.results 
      }, (error: any) => {
        console.error(error);
      });
    this.api.getConfig().subscribe(
      (result: any) => {
        this.config = result
      }, (error: any) => {
        console.error(error);
      });
  }

  public search(): void {
    if (this.queryText != '') {
      this.api.getSearchQuery(this.queryText).subscribe(
        (results: any) => {
          this.movieList = results.results;
        },
        (error: any) => {
          console.error(error);
        }
      )
    }
    else if(this.queryText === ''){
      this.getInitialMovies();
    }
  }

  public onClickBackButton(){
    this.queryText = '';
  }

}
