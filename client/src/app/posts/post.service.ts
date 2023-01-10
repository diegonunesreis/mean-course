import { Post } from "./post.model";
import { Observable, Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(public http: HttpClient) { }

  getPosts() {
    // square brackets for creating a new array
    // tree dots to create a copy of the instance of the array (spread operator)
    // return [...this.posts];

    this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
      .subscribe((res) => {
        console.log(res);
        this.posts = res.posts;
        this.postsUpdated.next([...this.posts])
      })
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title: title, content: content };

    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((res) => {
        console.log(res.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
      });
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }
}