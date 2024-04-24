import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order } from '../interfaces/order';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://example.com/api/orders'; // Adres API do zamówień

  constructor(private http: HttpClient) { }

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
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Metoda do dodawania nowego zamówienia
  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  // Metoda do aktualizowania istniejącego zamówienia
  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${order.id}`, order);
  }

  // Metoda do usuwania zamówienia
  deleteOrder(id: number): Observable<Order> {
    return this.http.delete<Order>(`${this.apiUrl}/${id}`);
  }
}
