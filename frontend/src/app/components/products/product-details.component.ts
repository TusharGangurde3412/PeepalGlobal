import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  loading = true;
  error = '';

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

  getProductImage(img: string): string {
    if (img && img.startsWith('/uploads/')) {
      return environment.imageBaseUrl + img;
    }
    return img;
  }
}
