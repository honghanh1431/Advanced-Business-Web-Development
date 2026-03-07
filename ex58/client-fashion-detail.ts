import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fashion, ClientFashionService } from '../client-my-services/client-fashion-services';

@Component({
  selector: 'app-fashion-detail',
  standalone: false,
  templateUrl: './client-fashion-detail.html',
  styleUrls: ['./client-fashion-detail.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ClientFashionDetail implements OnInit {
  fashion: Fashion | null = null;
  errorMessage = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientFashionService: ClientFashionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFashion(id);
    }
  }

  loadFashion(id: string): void {
    this.loading = true;
    this.clientFashionService.getFashion(id).subscribe({
      next: (data) => {
        this.fashion = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Lỗi khi tải dữ liệu';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getThumbnailSrc(): string {
    return this.fashion?.thumbnail || 'assets/placeholder.jpg';
  }
}