import { Component, OnInit } from '@angular/core';
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

  submitted = false;
  submitting = false;
  error = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const productId = params.get('productId') || '';
      if (productId) {
        this.quoteForm.productId = productId;
        // Fetch product name
        this.apiService.getProductById(productId).subscribe({
          next: (product: any) => {
            this.quoteForm.productName = product?.name || '';
          },
          error: () => {
            this.quoteForm.productName = '';
          }
        });
      }
    });
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
