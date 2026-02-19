import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  loading = true;
  page = 1;
  limit = 12;
  total = 0;
  categories = ['Agriculture', 'Automobiles', 'Textiles', 'Industrial', 'Handicrafts'];
  selectedCategory = '';
  searchTerm = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] ? parseInt(params['page']) : 1;
      this.selectedCategory = params['category'] || '';
      this.searchTerm = params['search'] || '';
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts(this.page, this.limit, this.selectedCategory, this.searchTerm)
      .subscribe({
        next: (data) => {
          this.products = data.products;
          this.total = data.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.page = 1;
    this.loadProducts();
  }

  onSearch(event: any): void {
    const term = (event.target?.value || '').trim();
    this.searchTerm = term;
    this.page = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    this.page = page;
    window.scrollTo(0, 0);
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  get pages(): number[] {
    const arr = [];
    for (let i = 1; i <= this.totalPages; i++) {
      arr.push(i);
    }
    return arr;
  }
}
