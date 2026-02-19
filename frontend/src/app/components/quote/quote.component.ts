import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {
  quoteForm = {
    productId: '',
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
      }
    });
  }

  submitQuote(): void {
    this.submitting = true;
    this.error = '';

    this.apiService.submitInquiry(this.quoteForm).subscribe({
      next: () => {
        this.submitted = true;
        this.submitting = false;
        this.quoteForm = {
          productId: '',
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
