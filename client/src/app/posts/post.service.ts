import { Post } from "./post.model";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(public http: HttpClient) { }

  getPosts() {
    // square brackets for creating a new array
    // tree dots to create a copy of the instance of the array (spread operator)
    // return [...this.posts];

    this.http
      .get<{
        message: string,
        posts: {
          title: string,
          content: string,
          _id: string,
          __v: number
        }[]
      }>(
        "http://localhost:3000/api/posts"
      )
      .pipe(map((data) => {
        return data.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        });
      }))
      .subscribe((res) => {
        this.posts = res;
        this.postsUpdated.next([...this.posts])
      })
  }

  addPost(title: string, content: string) {
    const post: Post = { id: "", title: title, content: content };

    this.http.post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
      .subscribe((res) => {
        post.id = res.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    this.http.delete(`http://localhost:3000/api/posts/${id}`)
      .subscribe((res) => {
        this.posts = this.posts.filter(p => p.id != id);
        this.postsUpdated.next([...this.posts]);
      })
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }
}