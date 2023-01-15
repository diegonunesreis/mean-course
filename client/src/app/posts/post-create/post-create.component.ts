import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap, Route } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private editMode = false;
  private postId: string | null = null;
  isLoading = false;
  post: Post | null = null;

  constructor(
    private postsService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.editMode = true;
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId!).subscribe((res) => {
          this.isLoading = false
          this.post = { id: res._id, title: res.title, content: res.content };
        });
      }
    });
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (!this.editMode) {
      this.postsService.addPost(form.value.title, form.value.content);
    }
    else {
      this.postsService.updatePost(this.postId!, form.value.title, form.value.content);
    }
    form.resetForm();
    this.router.navigate(['/']);
  }
}