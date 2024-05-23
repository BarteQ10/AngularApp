import { Component, OnInit } from '@angular/core';

import { Order, PostponeOrder } from '../../interfaces/order';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { QrCodeModalComponent } from '../qr-code-modal/qr-code-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, CheckboxModule,
    MultiSelectModule, FormsModule, CardModule, DialogModule, DropdownModule],
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
  openButtonVisible: boolean = false;
  buttonSeverity: string = "";
  daysDialogVisible: boolean = false;
  selectedDays: number = 1;
  selectedOption: string | null = null;
  selectedOrder: Order | null = null;
  daysOptions: any[] = Array.from({ length: 7 }, (_, i) => ({ label: `${i + 1} days`, value: i + 1 }));
  constructor(private orderService: OrderService, private dialogService: DialogService
    ,private messageService: MessageService) {
    this.columnOptions = [
      { label: 'Status Name', field: 'StatusName', header: 'Status Name' },
      { label: 'Sender Mail', field: 'SenderMail', header: 'Sender Mail' },
      { label: 'Receiver Mail', field: 'ReceiverMail', header: 'Receiver Mail' },
      { label: 'Description', field: 'Description', header: 'Description' },
      { label: 'Start Date', field: 'StartDate', header: 'Start Date' },
      { label: 'End Date', field: 'EndDate', header: 'End Date' },
      { label: 'Machine From', field: 'MachineCodeFrom', header: 'Machine From' },
      { label: 'Machine To', field: 'MachineCodeTo', header: 'Machine To' },
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
    this.getOrders();
  }
  getOrders() {
    this.orderService.getAllOrdersForUser().subscribe(
      (orders: Order[]) => {
        this.orders = orders;
      },
      (error) => {
        console.error('Błąd podczas pobierania zamówień:', error);
      }
    );
  }
  refreshOrders(){
    this.orderService.getAllOrdersForUser().subscribe(
      (orders: Order[]) => {
        this.orders = orders.filter(order => order.ReceiverMail === this.senderEmail).filter(order => order.IsReturn === false);;
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
  showEditButtonCondition(order: Order): boolean {
    // Define your condition here, for example, only show the button if SenderMail matches the session email
    //return order['SenderMail'] === this.senderEmail;
    return true
  }
  openQrCodeModal(order: Order): void {
    const ref = this.dialogService.open(QrCodeModalComponent, {
      header: 'QR Code',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' }, // Styl zawartości modala
      data: { orderData: "" + order.ChamberId } // Dane przekazywane do komponentu modalnego
    });
    console.log(order.ChamberId)

    // Obsługa zdarzenia zamknięcia modala
    ref.onClose.subscribe(() => {
      // Tutaj możesz dodać kod, który zostanie wykonany po zamknięciu modala
    });
  }
  openPostponeOrderModal(order: Order): void {
    this.selectedOrder = order;
    this.daysDialogVisible = true;
  }
  saveSelectedDays() {
    if (this.selectedOrder) {
      const postponeOrder: PostponeOrder = { OrderId: this.selectedOrder.Id, PostponedDays: this.selectedDays };
      this.orderService.postponeOrder(postponeOrder).subscribe(() => {
        this.refreshOrders(); // Refresh orders
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order postponed successfully' });
      }, (error) => {
        console.error('Error postponing order:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to postpone order' });
      });
      this.daysDialogVisible = false;
    }
  }
  

  selectOption(option: string) {
    this.selectedOption = option;
    this.openButtonVisible = false;
    // Apply filtering based on selected option
    if (option === 'send') {
      this.orders = this.orders.filter(order => order.SenderMail === this.senderEmail).filter(order => order.IsReturn === false);
    } else if (option === 'receive') {
      this.orders = this.orders.filter(order => order.ReceiverMail === this.senderEmail).filter(order => order.IsReturn === false);
    } else if (option === 'returns') {
      this.orders = this.orders.filter(order => order.IsReturn === true);
    }
  }
  updateButtonLabel(order: Order): void {
    this.openButtonVisible = false;
    if (this.selectedOption === 'send') {
      if (order.StatusName === "Paczka czeka na umieszczenie w automacie nadawczym.") {
        this.editButtonLabel = "Open chamber";
        this.openButtonVisible = true;
        this.buttonSeverity = "success";
      }
    }
    else if (this.selectedOption === 'receive') {
      if (order.StatusName === "Paczka gotowa do odbioru.") {
        this.editButtonLabel = "Open chamber";
        this.buttonSeverity = "success";
        this.openButtonVisible = true;
      } else if (order.StatusName === "Paczka czeka na umieszczenie w automacie nadawczym." ||
        order.StatusName === "Paczka została umieszczona w automacie nadawczym." ||
        order.StatusName === "Paczka odebrana przez kuriera." ||
        order.StatusName === "Paczka dotarła do sortowni.") {
          this.editButtonLabel = "Postpone order";
          this.openButtonVisible = true;
          this.buttonSeverity = "secondary";
      }
    }
    else if (this.selectedOption === 'returns') {
      if (order.StatusName === "Paczka zwrotna gotowa do odbioru.") {
        this.editButtonLabel = "Open chamber";
        this.openButtonVisible = true;
        this.buttonSeverity = "success";
      }
    }
  }

  handleButtonClick(order: Order): void {
    if (this.editButtonLabel === 'Postpone order') {
      this.openPostponeOrderModal(order);
    } else {
      this.openQrCodeModal(order);
    }
  }
  clearSelectedOption() {
    this.selectedOption = null;
    this.getOrders();
  }
}
