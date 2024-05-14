import { Component, OnInit } from '@angular/core';

import { Order } from '../../interfaces/order';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { QrCodeModalComponent } from '../qr-code-modal/qr-code-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, CheckboxModule, MultiSelectModule, FormsModule],
  providers: [DialogService],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: Order[] = []; 
  columnOptions: any[]; // Opcje kolumn
  selectedColumns: any[]; // Wybrane kolumny
  editButtonLabel: string = "Edit"; // Default label
  senderEmail: string | null = sessionStorage.getItem("email");
  showEditButton: boolean = true;
  constructor(private orderService: OrderService, private dialogService: DialogService) {
    this.columnOptions = [
      { label: 'Id', field: 'Id', header: 'Id' },
      { label: 'Status Name', field: 'StatusName', header: 'Status Name' },
      { label: 'Sender Mail', field: 'SenderMail', header: 'Sender Mail' },
      { label: 'Receiver Mail', field: 'ReceiverMail', header: 'Receiver Mail' },
      { label: 'Payment Method Name', field: 'PaymentMethodName', header: 'Payment Method Name' },
      { label: 'Description', field: 'Description', header: 'Description' },
      { label: 'Active', field: 'Active', header: 'Active' },
      { label: 'Start Date', field: 'StartDate', header: 'Start Date' },
      { label: 'End Date', field: 'EndDate', header: 'End Date' },
      { label: 'Machine From', field: 'MachineCodeFrom', header: 'Machine From' },
      { label: 'Machine To', field: 'MachineCodeTo', header: 'Machine To' },
      { label: 'Chamber', field: 'ChamberId', header: 'Chamber' },
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
    this.orderService.getAllOrdersForUser().subscribe(
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
  updateButtonLabel(order: Order): void {
    console.log(this.senderEmail)
    //Paczka odebrana przez kuriera z paczkomatu.
    //Paczka dostarczona do sortowni.
    //Paczka odebrana przez kuriera.
    //Paczka gotowa do odbioru.
    //Rozpoczęcie zwrotu paczki.
    //Paczka zwrotna gotowa do odbioru.
    if (order['SenderMail'] === this.senderEmail) {
      this.editButtonLabel = "Different Label"; // Set different label
    } else {
      
      if(order['StatusName'] === "Paczka gotowa do odbioru."){
        this.editButtonLabel = "Open chamber";
      }else{
        this.editButtonLabel = ""; // Set default label
      }
    }
  }
  showEditButtonCondition(order: Order): boolean {
    // Define your condition here, for example, only show the button if SenderMail matches the session email
    //return order['SenderMail'] === this.senderEmail;
    return true
  }
  openQrCodeModal(order: Order): void {
    const ref = this.dialogService.open(QrCodeModalComponent, {
      header: 'QR Code', // Nagłówek modala
      width: '70%', // Szerokość modala
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' }, // Styl zawartości modala
      data: { orderData: ""+order.ChamberId } // Dane przekazywane do komponentu modalnego
    });
    console.log(order.ChamberId)
  
    // Obsługa zdarzenia zamknięcia modala
    ref.onClose.subscribe(() => {
      // Tutaj możesz dodać kod, który zostanie wykonany po zamknięciu modala
    });
  }
}
