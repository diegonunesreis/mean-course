import { Post } from "./post.model";
import { Observable, Subject } from 'rxjs';


export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post []>();

  getPosts() {
    // square brackets for creating a new array
    // tree dots to create a copy of the instance of the array (spread operator)
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    const post: Post = { title: title, content: content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts])
  }

  getPostUpdateListener(): Observable<Post[]>{
    return this.postsUpdated.asObservable();
  }
}