import { Component, OnInit } from '@angular/core';

import { Post } from './posts/post.model';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoading = false;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService
      .getProgressListener()
      .subscribe(res => {
        this.isLoading = res.show;
      });
  }
}
