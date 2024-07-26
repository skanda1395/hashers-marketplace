import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FOR_SALE } from '../../utilities/utilities';

declare const bootstrap: any;

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css',
  providers: [ProductsService, AuthService]
})
export class SellComponent {
  newProductForm: FormGroup;
  @Input() product: any;
  @Output() formSubmitted = new EventEmitter<void>();
  isEditing: boolean = false;
  imageDataUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private productsService: ProductsService, private authService: AuthService) {
    this.newProductForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      // image: ['', [Validators.required]]
    });
  }

  ngOnChanges() {
    if (this.product) {
      this.isEditing = true;
      this.newProductForm.patchValue(this.product);
    } else {
      this.isEditing = false;
      this.newProductForm.reset();
    }
  }

  get formInvalid() {
    return this.imageDataUrl === null || this.newProductForm.invalid;
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        console.log("READER RESULT", reader.result);
        this.imageDataUrl = reader.result;
      }

      reader.readAsDataURL(file);
    }
  }

  addOrUpdateProductForSale() {
    if (this.newProductForm.invalid) return;
    const { name,  description, price } = this.newProductForm.value;
    const currentUser = this.authService.getCurrentUser();
   
    if (this.isEditing) {
      const updatedProduct: Product = { ...this.product, name, description, price: `${price}` };
      this.productsService.updateProductForSale(updatedProduct as Product).subscribe(
        response => { 
          this.newProductForm.reset();
          this.formSubmitted.emit(); 
          // SHOW SUCCESS TOAST
        },
        error => console.log(error)
      )
    } else {
      console.log("IMAGE DATA URL", this.imageDataUrl);
      const newProduct = { name, description, price: `${price}`, status: FOR_SALE, owner: currentUser, imageDataUrl: `${this.imageDataUrl}`, dateAdded: new Date().toISOString() };
      this.productsService.addProductForSale(newProduct as Product).subscribe(
        response => { 
          this.newProductForm.reset();
          this.formSubmitted.emit(); 
          // SHOW SUCCESS TOAST
        },
        error => console.log(error)
      ) 
    }
  }
}
