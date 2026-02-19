import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  activeTab: 'products' | 'inquiries' | 'contacts' = 'products';

  products: any[] = [];
  inquiries: any[] = [];
  contacts: any[] = [];

  loadingProducts = false;
  loadingInquiries = false;
  loadingContacts = false;

  productForm = {
    _id: '',
    name: '',
    description: '',
    category: 'Agriculture',
    price: 0,
    image: '',
    featured: false,
    inStock: true
  };

  categories = ['Agriculture', 'Automobiles', 'Textiles', 'Industrial', 'Handicrafts'];
  formMode: 'create' | 'edit' = 'create';
  success = '';
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadInquiries();
    this.loadContacts();
  }

  setTab(tab: 'products' | 'inquiries' | 'contacts'): void {
    this.activeTab = tab;
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.apiService.getProducts(1, 100).subscribe({
      next: (res) => {
        this.products = res.products || [];
        this.loadingProducts = false;
      },
      error: () => {
        this.loadingProducts = false;
      }
    });
  }

  loadInquiries(): void {
    this.loadingInquiries = true;
    this.apiService.getInquiries(1, 100).subscribe({
      next: (res) => {
        this.inquiries = res.inquiries || [];
        this.loadingInquiries = false;
      },
      error: () => {
        this.loadingInquiries = false;
      }
    });
  }

  loadContacts(): void {
    this.loadingContacts = true;
    this.apiService.getContacts(1, 100).subscribe({
      next: (res) => {
        this.contacts = res.contacts || [];
        this.loadingContacts = false;
      },
      error: () => {
        this.loadingContacts = false;
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
      featured: this.productForm.featured,
      inStock: this.productForm.inStock
    };

    const request$ =
      this.formMode === 'edit'
        ? this.apiService.updateProduct(this.productForm._id, payload)
        : this.apiService.createProduct(payload);

    request$.subscribe({
      next: () => {
        this.success = this.formMode === 'edit' ? 'Product updated successfully.' : 'Product added successfully.';
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
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
      featured: Boolean(product.featured),
      inStock: product.inStock !== false
    };
    this.activeTab = 'products';
    this.success = '';
    this.error = '';
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
      featured: false,
      inStock: true
    };
  }
}
