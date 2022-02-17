import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { MoviesRoutingModule } from './movies-routing.module';

import { HttpClientModule} from '@angular/common/http';
import { MovieService } from '../services/api.service';

import { MoviesPage } from './movies.page';
import { MovieDetailsPage } from './movie-details/movie-details.page';
import { MovieCardComponent } from './movie-card/movie-card.component'

@NgModule({
  imports: [
    HttpClientModule,
    IonicModule,
    CommonModule,
    FormsModule,
    MoviesRoutingModule,
    RouterModule.forChild([
      { path: '', component: MoviesPage },
      { path: 'details/:id', component: MovieDetailsPage }
    ])
  ],
  declarations: [
    MoviesPage,
    MovieDetailsPage,
    MovieCardComponent
  ],
  providers: [
    MovieService
  ]
})
export class MoviesModule {}
