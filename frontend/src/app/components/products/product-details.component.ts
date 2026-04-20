import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  loading = true;
  error = '';
  showGallery = false;
  currentImageIndex = 0;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Product not found.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No product specified.';
      this.loading = false;
    }
  }

  openGallery(): void {
    this.showGallery = true;
    this.currentImageIndex = 0;
  }

  closeGallery(): void {
    this.showGallery = false;
  }

  nextImage(): void {
    if (this.product && this.product.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  previousImage(): void {
    if (this.product && this.product.images) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  getProductImage(img: string): string {
    if (img && img.startsWith('/uploads/')) {
      return environment.imageBaseUrl + img;
    }
    return img;
  }
}
