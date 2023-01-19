import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
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
  form: FormGroup | undefined;


  constructor(
    private postsService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm(); 
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.editMode = true;
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId!).subscribe((res) => {
          this.isLoading = false
          this.post = { id: res._id, title: res.title, content: res.content };
          console.log(this.post);
          this.form?.setValue({ title: this.post.title, content: this.post.content});
        });
      }
    });
  }

  createForm() {
    this.form = new FormGroup({
      'title': new FormControl(
        null,
        { validators: [Validators.required, Validators.minLength(3)] }
      ),
      'content': new FormControl(
        null,
        { validators: [Validators.required] }
      )
    });
  }

  onAddPost() {
    if (this.form?.invalid) {
      return;
    }
    this.isLoading = true;
    if (!this.editMode) {
      this.postsService.addPost(this.form?.value.title, this.form?.value.content);
    }
    else {
      this.postsService.updatePost(this.postId!, this.form?.value.title, this.form?.value.content);
    }
    this.form?.reset();
    this.router.navigate(['/']);
  }
}