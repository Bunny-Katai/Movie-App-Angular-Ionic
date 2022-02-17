import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface StorageChangeAction {
  type: string,
  key: string,
  value: any
}

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  private prefix = 'MovieAppData_';
  private storage: Storage = sessionStorage;

  private storageChangeSubject = new Subject<StorageChangeAction>();
  
  getObservableStorageChanges(): Observable<StorageChangeAction>{
    return this.storageChangeSubject.asObservable();
  }

  read( key:string ): any | undefined {
    const value: any = this.storage.getItem(this.prefix + key);
    if (value === undefined){
      this.storageChangeSubject.next({type: 'read', key: key, value: undefined});
      return undefined;
    } 
    else {
      this.storageChangeSubject.next({type: 'read', key: key, value: value});
      return JSON.parse(value);
    }
  }

  write( key:string, value:any ) {
    this.storage.setItem(this.prefix + key, JSON.stringify(value));
    this.storageChangeSubject.next({type: 'write', key: key, value: value});
  }

  remove( key:string ) {
    const value = null;
    this.storage.removeItem(this.prefix + key);
    this.storageChangeSubject.next({type: 'remove', key: key, value: value});
  }

}
