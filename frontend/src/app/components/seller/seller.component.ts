import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit {
  products: any[] = [];
  loadingProducts = false;
  saving = false;
  success = '';
  error = '';

  productForm = {
    _id: '',
    name: '',
    description: '',
    category: 'Agriculture',
    price: 0,
    image: '',
    inStock: true
  };

  categories = ['Agriculture', 'Automobiles', 'Textiles', 'Industrial', 'Handicrafts'];
  formMode: 'create' | 'edit' = 'create';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.apiService.getMyProducts().subscribe({
      next: (res) => {
        this.products = res?.products || [];
        this.loadingProducts = false;
      },
      error: (err) => {
        this.loadingProducts = false;
        this.error = err?.error?.error || 'Failed to load your products.';
      }
    });
  }

  submitProduct(): void {
    this.success = '';
    this.error = '';

    if (!this.productForm.name || !this.productForm.category) {
      this.error = 'Name and category are required.';
      return;
    }

    const payload = {
      name: this.productForm.name,
      description: this.productForm.description,
      category: this.productForm.category,
      price: this.productForm.price,
      image: this.productForm.image,
      inStock: this.productForm.inStock
    };

    this.saving = true;

    const request$ =
      this.formMode === 'edit'
        ? this.apiService.updateProduct(this.productForm._id, payload)
        : this.apiService.createProduct(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.success = this.formMode === 'edit' ? 'Product updated successfully.' : 'Product added successfully.';
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.error || 'Failed to save product.';
      }
    });
  }

  editProduct(product: any): void {
    this.formMode = 'edit';
    this.productForm = {
      _id: product._id || '',
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'Agriculture',
      price: Number(product.price || 0),
      image: product.image || '',
      inStock: product.inStock !== false
    };
  }

  deleteProduct(productId: string): void {
    if (!confirm('Delete this product?')) return;

    this.apiService.deleteProduct(productId).subscribe({
      next: () => {
        this.success = 'Product deleted successfully.';
        this.loadProducts();
      },
      error: (err) => {
        this.error = err?.error?.error || 'Failed to delete product.';
      }
    });
  }

  resetForm(): void {
    this.formMode = 'create';
    this.productForm = {
      _id: '',
      name: '',
      description: '',
      category: 'Agriculture',
      price: 0,
      image: '',
      inStock: true
    };
  }
}
