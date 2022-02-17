import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SessionStorageService, StorageChangeAction } from '../app-global-services/session-storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  isLoggedIn: boolean;

  constructor(
    private storageService: SessionStorageService,
    private router: Router
  ) {}

  ngOnInit(){
    this.isLoggedInLogic();
  }

  isLoggedInLogic() {
    this.isLoggedIn = this.storageService.read('isAuthed') ? true : false;
    this.storageService.getObservableStorageChanges().subscribe((changeAction:StorageChangeAction) => {
      const {key, value} = changeAction;
      if(key === 'isAuthed'){ this.isLoggedIn = value ? true : false }
    });
  }
 
  
  goToMovies(){
    this.router.navigateByUrl('tabs/movies');
  }

}
