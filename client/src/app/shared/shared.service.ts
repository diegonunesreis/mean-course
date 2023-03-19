import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SharedService {
  private progressSubject = new Subject<{ show: boolean }>

  showProgress() {
    this.progressSubject.next({ show: true })
  }

  hideProgress() {
    this.progressSubject.next({ show: false })
  }

  getProgressListener() {
    return this.progressSubject.asObservable();
  }
}