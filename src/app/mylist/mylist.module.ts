import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyListRoutingModule } from './mylist-routing.module';
import { MyListPage } from './mylist.page';
import { CustomPipe } from './custom-pipe/custom.pipe';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MyListRoutingModule
  ],
  declarations: [MyListPage, CustomPipe]
})
export class MyListModule {}
