import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PaymentMethod, SizeAndPrice } from '../interfaces/payment';
import { ApiConfig } from '../../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = ApiConfig.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getSizePrices(): Observable<SizeAndPrice[]> {
    const headers = this.createHeaders();
    return this.http.get<SizeAndPrice[]>(`${this.baseUrl}/get-size-prices/`, { headers });
  }

  getAllPaymentMethods(): Observable<PaymentMethod[]> {
    const headers = this.createHeaders();
    return this.http.get<PaymentMethod[]>(`${this.baseUrl}/get-all-payment-methods/`, { headers });
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
  }

  private getAuthToken(): string {
    return sessionStorage.getItem('jwt_token') || '';
  }
}
