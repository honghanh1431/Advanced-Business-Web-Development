import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FashionService, Fashion } from '../my-services/fashion-services';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-fashion-detail',
  standalone: false,
  templateUrl: './fashion-detail.html',
  styleUrl: './fashion-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FashionDetail implements OnInit {
  fashionForm: FormGroup;
  fashion: Fashion | null = null;
  isEditMode = false;
  isViewMode = false;
  errorMessage = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '250px',
    minHeight: '150px',
    placeholder: 'Nhập nội dung chi tiết...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [[], []]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private fashionService: FashionService,
    private cdr: ChangeDetectorRef
  ) {
    this.fashionForm = this.fb.group({
      style: ['', Validators.required],
      fashion_title: ['', Validators.required],
      fashion_details: ['', Validators.required],
      thumbnail: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const path = this.route.snapshot.url.map(s => s.path).join('/');

    if (path.includes('edit')) {
      this.isEditMode = true;
      if (id) this.loadFashion(id);
    } else if (path.includes('new')) {
      this.isEditMode = true;
    } else if (id) {
      this.isViewMode = true;
      this.loadFashion(id);
    }
  }

  loadFashion(id: string): void {
    this.fashionService.getFashion(id).subscribe({
      next: (data) => {
        this.fashion = data;
        if (!this.isViewMode) {
          this.fashionForm.patchValue(data);
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.fashionForm.invalid) return;
    const fashionData: Fashion = this.fashionForm.value;

    if (this.fashion && this.fashion._id) {
      this.fashionService.updateFashion(this.fashion._id, fashionData).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.errorMessage = err.message;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.fashionService.addFashion(fashionData).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          this.errorMessage = err.message;
          this.cdr.markForCheck();
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fashionForm.patchValue({ thumbnail: e.target.result });
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  getThumbnailSrc(): string {
    if (this.isViewMode && this.fashion) {
      return this.fashion.thumbnail || 'assets/placeholder.jpg';
    }
    return this.fashionForm.get('thumbnail')?.value || 'assets/placeholder.jpg';
  }
}