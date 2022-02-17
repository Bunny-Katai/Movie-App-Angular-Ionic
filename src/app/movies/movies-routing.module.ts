import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesPage } from './movies.page';
import { MovieDetailsPage } from './movie-details/movie-details.page';

const routes: Routes = [
  {
    path: '',
    component: MoviesPage
  },
  {
    path: 'details/:id',
    component: MovieDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule {}
