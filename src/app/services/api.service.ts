import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'any'
})
export class MovieService {

  private API_KEY = environment.movieAPIKey;

  constructor(private http: HttpClient) { }

  fetchMovies(): Observable<any[]> {
    return this.http.get<any[]>(`https://api.themoviedb.org/3/movie/top_rated?api_key=${this.API_KEY}`);
  }
  
  getDetails(id:string) {
    return this.http.get<any>(`https://api.themoviedb.org/3/movie/${id}?api_key=${this.API_KEY}&language=en-US`);
  }

  getConfig(): Observable<any> {
    return this.http.get<any>(`https://api.themoviedb.org/3/configuration?api_key=${this.API_KEY}`);
  }

  getImages(id: number): Observable<any> {
    return this.http.get<any>(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${this.API_KEY}`);
  }

  getSearchQuery(query: string): Observable<any> {
    console.log(query)
    const reformattedQuery: string = query.replace(' ', '+');
    return this.http.get<any>(`https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&query=${reformattedQuery}`);
  }

}
