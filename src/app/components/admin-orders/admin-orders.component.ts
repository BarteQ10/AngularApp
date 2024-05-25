import { Component, OnInit } from '@angular/core';
import { Order } from '../../interfaces/order';
import { OrderService } from '../../services/order.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModifyOrderModalComponent } from '../modify-order-modal/modify-order-modal.component';
import { CalendarModule } from 'primeng/calendar';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, CheckboxModule, 
    MultiSelectModule, FormsModule, CalendarModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
  providers:[DialogService]
})
export class AdminOrdersComponent implements OnInit {

  orders: Order[] = []; 
  filteredOrders: Order[] = [];
  columnOptions: any[]; 
  selectedColumns: any[]; 
  selectedDateRange!: Date;
  constructor(private orderService: OrderService,private dialogService: DialogService) {
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

  let storedColumns = localStorage.getItem('selectedColumnsAdminOrders');
    if (!storedColumns) {
        storedColumns = JSON.stringify(this.columnOptions.slice(0, 5).map(option => option)); // Ustaw pierwsze pięć kolumn
        localStorage.setItem('selectedColumnsAdminOrders', storedColumns);
    }

    this.selectedColumns = JSON.parse(storedColumns);
   } 
  ngOnInit(): void {
    this.getOrders();
  }
  onColumnToggle(event: any): void {
    this.selectedColumns = event.value;
    localStorage.setItem('selectedColumnsAdminOrders', JSON.stringify(this.selectedColumns));
}
getOrders() {
  this.orderService.getAllOrders().subscribe(
    (orders: Order[]) => {
      this.orders = orders; 
      this.filteredOrders = [...orders];
      this.filterOrdersByDate();
    },
    (error) => {
      console.error('Error fetching orders:', error);
    }
  );
}

filterOrdersByDate() {
  if (Array.isArray(this.selectedDateRange) && this.selectedDateRange.length >= 2) {
    const [startDate, endDate] = this.selectedDateRange;
    this.filteredOrders = this.orders.filter(order =>
      new Date(order.StartDate) >= startDate && new Date(order.StartDate) <= endDate
    );
  } else {
    this.filteredOrders = [...this.orders];
  }
}

openModal(order: Order) {
  const ref = this.dialogService.open(ModifyOrderModalComponent, {
    header: 'Edit Order',
    width: '80%',
    contentStyle: { 'max-height': '350px', 'overflow': 'auto' },
    data: { order }
  });
  ref.onClose.subscribe((updatedOrder: Order) => {
    this.getOrders();
  });
}
exportToPDF() {
  const doc = new jsPDF(); // Create a new jsPDF object
  const columns = this.selectedColumns.map(col => col.header);
  const data = this.filteredOrders.map(order => 
    this.selectedColumns.map(col => 
      this.removePolishSigns(order[col.field as keyof Order])
    )
  );

  autoTable(doc,{
    head: [columns],
    body: data,
    didParseCell: function(data) {
      data.cell.styles.font = "times"; // Set font type to Times New Roman
    },
    horizontalPageBreak: true,
  });

  doc.save('orders.pdf');
}

removePolishSigns(text:any) {
  if (typeof text !== 'string') {
    return text; // If text is not a string, return an empty string
  }
  // Replace Polish signs with their non-accented counterparts
  return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, function(match) {
    switch(match) {
      case 'ą': return 'a';
      case 'ć': return 'c';
      case 'ę': return 'e';
      case 'ł': return 'l';
      case 'ń': return 'n';
      case 'ó': return 'o';
      case 'ś': return 's';
      case 'ź': return 'z';
      case 'ż': return 'z';
      case 'Ą': return 'A';
      case 'Ć': return 'C';
      case 'Ę': return 'E';
      case 'Ł': return 'L';
      case 'Ń': return 'N';
      case 'Ó': return 'O';
      case 'Ś': return 'S';
      case 'Ź': return 'Z';
      case 'Ż': return 'Z';
      default: return match; // Return original character if not found in switch case
    }
  });
}
}
