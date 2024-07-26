import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../interfaces/product';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product!: Product;
  @Output() buy = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() toSale = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  constructor(private authService: AuthService) {}

  buyProduct() {
    this.buy.emit(this.product.id);
  }

  deleteProduct() {
    this.delete.emit(this.product.id);
  }

  editProduct() {
    this.edit.emit(this.product.id);
  }

  moveToSale() {
    this.toSale.emit(this.product.id);
  }

  get productImage() {
    return this.product.imageDataUrl || "Pixel_6a.jpeg";
  }

  get canSell(): boolean {
    return this.product.status === "SOLD";
  }

  get canBuy(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return this.product.status === 'SALE' && this.product.owner !== currentUser;
  }

  get canTrade(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return this.product.status === 'SALE' && this.product.owner !== currentUser;
  }

  get canEdit(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return this.product.status === 'SALE' && this.product.owner === currentUser;
  }

  get canDelete(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return this.product.status === 'SALE' && this.product.owner === currentUser;
  }
}
