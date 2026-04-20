import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  products: any[] = [];
  loading = true;
  error = '';
  selectedCategory: string = '';
  categories: string[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts(1, 1000).subscribe({
      next: (data) => {
        this.products = data.products || [];
        this.extractCategories();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  extractCategories(): void {
    const cats = new Set(this.products.map(p => p.category));
    this.categories = Array.from(cats).sort();
  }

  get filteredProducts(): any[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter(p => p.category === this.selectedCategory);
  }

  getProductImage(product: any): string {
    if (Array.isArray(product.images) && product.images.length > 0) {
      const image = product.images[0];
      if (image && image.startsWith('/uploads/')) {
        return environment.imageBaseUrl + image;
      }
      return image;
    }
    return 'assets/placeholder.jpg';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (target) {
      target.src = 'assets/placeholder.jpg';
    }
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  clearFilter(): void {
    this.selectedCategory = '';
  }
}
