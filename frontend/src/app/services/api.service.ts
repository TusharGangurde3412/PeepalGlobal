  // Image upload
 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Auth
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/me`, { headers: this.getAuthHeaders() });
  }

  // Products
  getProducts(page = 1, limit = 12, category?: string, search?: string): Observable<any> {
    let url = `${this.apiUrl}/products?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    return this.http.get(url);
  }

  getFeaturedProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/featured`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}`);
  }

  // Inquiries
  submitInquiry(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inquiries`, data);
  }

  getInquiries(page = 1, limit = 20, status?: string): Observable<any> {
    let url = `${this.apiUrl}/inquiries?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  // Contacts
  submitContact(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacts`, data);
  }

  getContacts(page = 1, limit = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin - Product CRUD
  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, data, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.getAuthHeaders() });
  }

  // Seller - Product CRUD (scoped by backend ownership)
  getMyProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/my`, { headers: this.getAuthHeaders() });
  }

  // Token management
  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user || {}));
  }

  getUser(): any {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
   uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  } 
  // uploadImage(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   return this.http.post(`${this.apiUrl}/upload`, formData);
  // }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}

