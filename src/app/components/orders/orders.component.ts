import { Component, OnInit } from '@angular/core';

import { Order } from '../../interfaces/order';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, CheckboxModule, MultiSelectModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: Order[] = []; 
  columnOptions: any[]; // Opcje kolumn
  selectedColumns: any[]; // Wybrane kolumny
  constructor(private orderService: OrderService) {
    this.columnOptions = [
      { label: 'Id', field: 'Id', header: 'Id' },
      { label: 'Status Name', field: 'StatusName', header: 'Status Name' },
      { label: 'Sender Mail', field: 'SenderMail', header: 'Sender Mail' },
      { label: 'Receiver Mail', field: 'ReceiverMail', header: 'Receiver Mail' },
      { label: 'Chamber Size', field: 'ChamberSize', header: 'Chamber Size' },
      { label: 'Payment Method Name', field: 'PaymentMethodName', header: 'Payment Method Name' },
      { label: 'Description', field: 'Description', header: 'Description' },
      { label: 'Active', field: 'Active', header: 'Active' },
      { label: 'Start Date', field: 'StartDate', header: 'Start Date' },
      { label: 'End Date', field: 'EndDate', header: 'End Date' },
      { label: 'Machine Id From', field: 'MachineIdFrom', header: 'Machine Id From' },
      { label: 'Machine Id To', field: 'MachineIdTo', header: 'Machine Id To' },
      { label: 'Delivery Date', field: 'DeliveryDate', header: 'Delivery Date' },
      { label: 'Return Delivery Date', field: 'ReturnDeliveryDate', header: 'Return Delivery Date' },
      { label: 'Postponed', field: 'Postponed', header: 'Postponed' },
      { label: 'Postponed Days', field: 'PostponedDays', header: 'Postponed Days' },
      { label: 'Is Return', field: 'IsReturn', header: 'Is Return' },
      { label: 'Delivery Cost', field: 'DeliveryCost', header: 'Delivery Cost' }
  ];

  let storedColumns = localStorage.getItem('selectedColumns');
    if (!storedColumns) {
        storedColumns = JSON.stringify(this.columnOptions.slice(0, 5).map(option => option)); // Ustaw pierwsze pięć kolumn
        localStorage.setItem('selectedColumns', storedColumns);
    }

    this.selectedColumns = JSON.parse(storedColumns);
   } 
  ngOnInit(): void {
    this.orderService.getOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders; 
      },
      (error) => {
        console.error('Błąd podczas pobierania zamówień:', error);
      }
    );
  }
  onColumnToggle(event: any): void {
    this.selectedColumns = event.value;
    localStorage.setItem('selectedColumns', JSON.stringify(this.selectedColumns));
}
}
