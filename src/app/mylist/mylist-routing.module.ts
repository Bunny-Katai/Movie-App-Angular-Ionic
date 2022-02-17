import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyListPage } from './mylist.page';

const routes: Routes = [
  {
    path: '',
    component: MyListPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyListRoutingModule {}
