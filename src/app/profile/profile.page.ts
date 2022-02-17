import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../app-global-services/firebase.service';
import { Router } from '@angular/router';
import { SessionStorageService, StorageChangeAction } from '../app-global-services/session-storage.service';
import { Observable } from 'rxjs';

interface UserDetailsType {
  email?: string
}

@Component({
  selector: 'profile-page',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit {

  pageTitle = 'My Profile';

  isLoggedIn: boolean
  userDetails$: Observable<UserDetailsType>

  constructor(
    private router: Router,
    private auth: FirebaseService,
    private storageService: SessionStorageService
  ) {}

  ngOnInit() {
    this.isLoggedInLogic();
    this.userDetails$ = this.auth.getUserDetails();
  }

  logout() {
    this.auth.signoutUser();
  }

  // TEST(){
  //   this.auth.TESTreadUserCollection().then(docArray=>{console.log('my data', docArray)});
  // }

  isLoggedInLogic() {
    this.isLoggedIn = this.storageService.read('isAuthed') ? true : false;
    this.storageService.getObservableStorageChanges().subscribe((changeAction:StorageChangeAction) => {
      const {key, value} = changeAction;
      if(key === 'isAuthed'){ this.isLoggedIn = value ? true : false }
    });
  }

  goToRegister(){
    this.router.navigateByUrl('tabs/profile/register');
  }


}
