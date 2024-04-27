import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order } from '../interfaces/order';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://127.0.0.1:8000'

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Metoda do pobierania wszystkich zamówień
  getOrders(): Observable<Order[]> {
    //return this.http.get<Order[]>(this.apiUrl);
    const orders: Order[] = [
      { id: 1, customer: 'John Doe', orderDate: new Date(), status: 'Pending' },
      { id: 2, customer: 'Jane Smith', orderDate: new Date(), status: 'Processing' },
      { id: 3, customer: 'Alice Johnson', orderDate: new Date(), status: 'Completed' }
    ];
    // Zwróć przykładowe dane jako obserwowalną tablicę zamówień
    return of(orders);
  }

  // Metoda do pobierania jednego zamówienia po ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  createOrder(orderData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}` // Dodaj token autoryzacyjny
    });
    return this.http.post<any>(`${this.baseUrl}/create-order/`, orderData, { headers });
  }

  // Metoda do aktualizowania istniejącego zamówienia
  updateOrder(order: Order): Observable<Order> {
    
    return this.http.put<Order>(`${this.baseUrl}/${order.id}`, order);
  }

  // Metoda do usuwania zamówienia
  deleteOrder(id: number): Observable<Order> {
    return this.http.delete<Order>(`${this.baseUrl}/${id}`);
  }
  private getAuthToken(): string {
    return sessionStorage.getItem('jwt_token') || ''; // Sprawdź, czy token istnieje w sesji
  }
}
