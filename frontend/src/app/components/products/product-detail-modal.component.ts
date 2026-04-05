import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss']
})
export class ProductDetailModalComponent {
  @Input() product: any = null;
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() enquire = new EventEmitter<any>();

  onClose() {
    this.close.emit();
  }

  onEnquire() {
    this.enquire.emit(this.product);
  }
}
