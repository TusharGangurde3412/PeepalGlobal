import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  
  contactForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  };

  submitted = false;
  submitting = false;
  error = '';

  constructor(private apiService: ApiService) {}

  submitContact(): void {
    this.submitting = true;
    this.error = '';
    
    this.apiService.submitContact(this.contactForm).subscribe({
      next: () => {
        this.submitted = true;
        this.submitting = false;
        this.contactForm = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          category: 'general'
        };
        setTimeout(() => this.submitted = false, 5000);
      },
      error: (err) => {
        this.submitting = false;
        this.error = 'Error submitting message. Please try again.';
      }
    });
  }
}
