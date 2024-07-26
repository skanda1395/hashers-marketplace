import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from '../product/product.component';
import { SellComponent } from '../sell/sell.component';

declare const bootstrap: any;

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, ProductComponent, SellComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
  providers: [ProductsService, AuthService]
})
export class ItemsComponent implements OnInit {
  myItems: Product[] = [];
  filteredItems: Product[] = [];
  form: FormGroup;
  modalElement: any;
  selectedProduct: any = null;

  constructor(private productsService: ProductsService, private authService: AuthService, private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedOption: ["SALE"]
    });

  }

  ngOnInit(): void {
    this.form.get("selectedOption")?.valueChanges.subscribe(value => {
      this.filteredItems = this.myItems.filter(item => item.status === value);
    });
    this.fetchMyItems();
  }

  ngAfterViewInit() {
    this.modalElement = new bootstrap.Modal(document.getElementById('sellItemModal'))
  }

  fetchMyItems() {
    const currentUser = this.authService.getCurrentUser();
    this.productsService.getMyProducts(currentUser).subscribe(
      response => {
        this.myItems = response;
        this.filteredItems = this.myItems.filter(item => item.status ===  this.getSelectedOptionValue());
      },
      error => console.log(error)
    );
  }

  getSelectedOptionValue() {
    return this.form.get("selectedOption")?.value;
  }

  openSellItemModal() {
    if (!this.modalElement) return;
    this.selectedProduct = null;
    console.log("SET TO NULL");
    this.modalElement.show();
  }

  openEditItemModal(id: string) {
    if (!this.modalElement) return;
    const product = this.myItems.find(product => product.id === id);
    if (!product) return;
    this.selectedProduct = product;
    this.modalElement.show();
  }

  closeSellItemModal() {
    if (!this.modalElement) return;
    this.modalElement.hide();
    this.fetchMyItems();
  }

  deleteProduct(id: string) {
    this.productsService.deleteProduct(id).subscribe(
      response => {
        console.log(response);
        this.fetchMyItems();
        // SHOW SUCCESS TOAST
      },
      error => console.log(error)
    )
  }

  moveToSale(id: string) {
    const product = this.myItems.find(product => product.id === id);
    if (!product) return;
    const updatedProduct: Product = { ...product, status: "SALE", dateAdded: new Date().toISOString() };
    this.productsService.moveProductToSale(updatedProduct).subscribe(
      response => {
        console.log(response);
        this.fetchMyItems();
        // SHOW SUCCESS TOAST
      },
      error => console.log(error)
    )
  }

}
