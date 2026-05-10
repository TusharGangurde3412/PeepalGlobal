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
  validationErrors: { [key: string]: string } = {};

  get hasValidationErrors(): boolean {
    return Object.keys(this.validationErrors).length > 0;
  }

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

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    // Phone should contain only digits and be exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  clearValidationError(fieldName: string): void {
    delete this.validationErrors[fieldName];
  }

  validateForm(): boolean {
    this.validationErrors = {};
    let isValid = true;

    // Validate name
    if (!this.quoteForm.name || this.quoteForm.name.trim().length === 0) {
      this.validationErrors['name'] = 'Full name is required';
      isValid = false;
    } else if (this.quoteForm.name.trim().length < 2) {
      this.validationErrors['name'] = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Validate email
    if (!this.quoteForm.email || this.quoteForm.email.trim().length === 0) {
      this.validationErrors['email'] = 'Email is required';
      isValid = false;
    } else if (!this.validateEmail(this.quoteForm.email)) {
      this.validationErrors['email'] = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate phone
    if (!this.quoteForm.phone || this.quoteForm.phone.trim().length === 0) {
      this.validationErrors['phone'] = 'Phone number is required';
      isValid = false;
    } else if (!this.validatePhone(this.quoteForm.phone)) {
      this.validationErrors['phone'] = 'Phone number must be exactly 10 digits';
      isValid = false;
    }

    // Validate quantity
    if (!this.quoteForm.quantity || this.quoteForm.quantity < 1) {
      this.validationErrors['quantity'] = 'Quantity must be at least 1 tone';
      isValid = false;
    }

    // Validate destination country
    if (!this.quoteForm.destinationCountry || this.quoteForm.destinationCountry.trim().length === 0) {
      this.validationErrors['destinationCountry'] = 'Destination country is required';
      isValid = false;
    }

    // Validate incoterm
    if (!this.quoteForm.incoterm || this.quoteForm.incoterm.trim().length === 0) {
      this.validationErrors['incoterm'] = 'Shipping term is required';
      isValid = false;
    }

    // Validate payment mode
    if (!this.quoteForm.paymentMode || this.quoteForm.paymentMode.trim().length === 0) {
      this.validationErrors['paymentMode'] = 'Payment mode is required';
      isValid = false;
    }

    // Validate required by date if provided
    if (this.quoteForm.requiredBy) {
      const selectedDate = new Date(this.quoteForm.requiredBy);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        this.validationErrors['requiredBy'] = 'Required by date must be in the future';
        isValid = false;
      }
    }

    return isValid;
  }

  submitQuote(): void {
    if (!this.validateForm()) {
      this.error = 'Please fix the errors in the form';
      return;
    }

    this.submitting = true;
    this.error = '';

    // Only send productId and productName if present
    const payload = { ...this.quoteForm };
    
    // Clean productId - remove any prefix like "1: "
    if (payload.productId) {
      payload.productId = String(payload.productId).split(':').pop()?.trim() || '';
      if (!payload.productId) delete payload.productId;
    }
    
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
