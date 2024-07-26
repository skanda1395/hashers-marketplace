import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  private baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  addProductForSale(newProduct: Product) {
    return this.http.post(`${this.baseUrl}/products`, newProduct);
  }

  updateProductForSale(updatedProduct: Product) {
    return this.http.put<Product[]>(`${this.baseUrl}/products/${updatedProduct.id}`, updatedProduct);  
  }
  
  getAllProducts() {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getAllProductsExceptCurrentUser(email: string) {
    return this.http.get<Product[]>(`${this.baseUrl}/products?owner_ne=${email}`);
  }

  getMyProducts(email: string) {
    return this.http.get<Product[]>(`${this.baseUrl}/products?owner=${email}`);
  }

  buyProduct(product: Product) {
    return this.http.put<Product[]>(`${this.baseUrl}/products/${product.id}`, product);  
  }

  deleteProduct(id: string) {
    return this.http.delete<Product[]>(`${this.baseUrl}/products/${id}`);
  }

  moveProductToSale(product: Product) {
    return this.http.put<Product[]>(`${this.baseUrl}/products/${product.id}`, product);  
  }
}
