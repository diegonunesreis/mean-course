import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { Router } from "@angular/router";
import { mimeType } from "./mime-type.validator";
import { SharedService } from "src/app/shared/shared.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private editMode = false;
  private postId: string;
  isLoading = false;
  post: Post;
  form: FormGroup;
  imgPreview: string;

  constructor(
    private postsService: PostService,
    private sharedService: SharedService,
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
          this.form.setValue({ title: this.post.title, content: this.post.content, image: null });
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
      ),
      'image': new FormControl(
        null,
        {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        }
      )
    });
  }

  onImagePicked(event: Event) {
    this.sharedService.showProgress();

    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result.toString();
    };
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setTimeout(() => {
        this.sharedService.hideProgress();
      }, 1000);
    }
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (!this.editMode) {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }
    else {
      this.postsService.updatePost(this.postId!, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
    this.router.navigate(['/']);
  }
}