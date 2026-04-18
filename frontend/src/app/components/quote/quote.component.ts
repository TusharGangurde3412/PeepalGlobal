import { Component, OnInit } from '@angular/core';
import countriesData from '../../../assets/countries.json';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';


export interface QuoteForm {
  productId?: string;
  productName?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  quantity: number;
  destinationCountry: string;
  incoterm: string;
  requiredBy: string;
  paymentMode?: string;
  message: string;
}

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})


export class QuoteComponent implements OnInit {
  quoteForm: QuoteForm = {
    productId: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: 1,
    destinationCountry: '',
    incoterm: 'FOB',
    requiredBy: '',
    paymentMode: '',
    message: ''
  };

  countries: { name: string; dial_code: string }[] = [];
  selectedPhoneCountry: { name: string; dial_code: string } | null = null;
  products: any[] = [];
  submitted = false;
  submitting = false;
  error = '';
  selectedProductId: string = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Load countries
    this.countries = (countriesData as any[]);
    this.selectedPhoneCountry = this.countries.find(c => c.name === 'India') || this.countries[0];

    // Get product name from query params
    const productName = this.route.snapshot.queryParamMap.get('productName') || '';

    // Load all products for dropdown
    this.apiService.getProducts(1, 1000).subscribe({
      next: (data) => {
        this.products = data.products || [];
        // Auto-select product if productName was in query params
        if (productName) {
          const found = this.products.find(p => p.name === productName);
          if (found) {
            this.quoteForm.productId = found._id;
            this.quoteForm.productName = found.name;
            this.selectedProductId = found._id;
          }
        }
      },
      error: () => {
        this.products = [];
      }
    });
  }

  onProductChange(event: any): void {
    const selectedId = event.target.value;
    this.quoteForm.productId = selectedId;
    const found = this.products.find(p => p._id === selectedId);
    this.quoteForm.productName = found ? found.name : '';
  }

  onPhoneCountryChange(event: any): void {
    // No-op, handled by ngModel
  }

  submitQuote(): void {
    this.submitting = true;
    this.error = '';

    // Only send productId and productName if present
    const payload = { ...this.quoteForm };
    if (!payload.productId) delete payload.productId;
    if (!payload.productName) delete payload.productName;

    this.apiService.submitInquiry(payload).subscribe({
      next: () => {
        this.submitted = true;
        this.submitting = false;
        this.quoteForm = {
          productId: '',
          productName: '',
          name: '',
          email: '',
          phone: '',
          company: '',
          quantity: 1,
          destinationCountry: '',
          incoterm: 'FOB',
          requiredBy: '',
          message: ''
        };
        setTimeout(() => (this.submitted = false), 5000);
      },
      error: () => {
        this.submitting = false;
        this.error = 'Could not send your quote request. Please try again.';
      }
    });
  }
}
