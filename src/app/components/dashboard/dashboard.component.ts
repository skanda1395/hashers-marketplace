import { Component } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

declare const bootstrap: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProductComponent, HttpClientModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [ProductsService, AuthService]
})
export class DashboardComponent {
  productsList: Product[] = [];
  filteredProductsList: Product[] = [];
  selectedProductId: string = "";
  modalElement: any;
  searchQuery: string = "";
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortOptions: string = "priceAsc";

  constructor(private productsService: ProductsService, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.modalElement = new bootstrap.Modal(document.getElementById('confirmtionModal'))
    this.fetchProducts();
  }

  fetchProducts() {
    const currentUser = this.authService.getCurrentUser();
    this.productsService.getAllProductsExceptCurrentUser(currentUser).subscribe(
      response => {
        this.productsList = response;
        this.applyFilters();
      },
      error => console.log(error)
    );
  }

  applyFilters() {
    this.filteredProductsList = this.productsList
      .filter(product => this.filterBySearchQuery(product))
      .filter(product => this.filterByPrice(product))
      .sort((a, b) => this.sortProduct(a, b));
  }

  filterBySearchQuery(product: Product): boolean {
    if (!this.searchQuery) return true;
    return product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
  }

  filterByPrice(product: Product): boolean {
    const minPriceValid = this.minPrice === null || Number(product.price) >= this.minPrice;
    const maxPriceValid = this.maxPrice === null || Number(product.price) <= this.maxPrice;
    return minPriceValid && maxPriceValid;
  }

  sortProduct(a: Product, b: Product): number {
    switch(this.sortOptions) {
      case "priceAsc": return Number(a.price) - Number(b.price);
      case "priceDesc": return Number(b.price) - Number(a.price);
      case "dateAsc": return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case "dateDesc": return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      default: return 0;
    }
  }

  openConfirmationModal(id: string) {
    if (!this.modalElement) return;
    this.selectedProductId = id;
    this.modalElement.show();
  }

  confirmPurchase() {
    const product = this.productsList.find(product => product.id === this.selectedProductId);
    if (!product) return;
    const currentUser = this.authService.getCurrentUser();
    const updatedProduct: Product = { ...product, status: "SOLD", owner: currentUser };
    this.productsService.buyProduct(updatedProduct).subscribe(
      response => {
        console.log("SUCCESS");
        this.modalElement.hide();
        this.fetchProducts();
        // this.productsList = this.productsList.filter(product => product.id !== this.selectedProductId);
        // SHOW SUCCESS TOAST
      },
      error => console.log(error)
    );
  }
}
