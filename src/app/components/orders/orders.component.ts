import { Component, OnInit } from '@angular/core';

import { Order } from '../../interfaces/order';
import { OrderService } from '../../services/order.service';

import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: Order[] = []; // Załóżmy, że masz tablicę zamówień

  constructor(private orderService: OrderService) { } // Wstrzykuj OrderService

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders; // Przypisz pobrane zamówienia do właściwości orders
      },
      (error) => {
        console.error('Błąd podczas pobierania zamówień:', error);
      }
    );
  }
}
