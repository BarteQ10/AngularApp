import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Status } from '../../interfaces/status';
import { StatusService } from '../../services/status.service';
import { DropdownModule } from 'primeng/dropdown';
import { PaymentService } from '../../services/payment.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-modify-order-modal',
  templateUrl: './modify-order-modal.component.html',
  styleUrls: ['./modify-order-modal.component.css'],
  imports: [FormsModule, InputTextModule, InputNumberModule, CheckboxModule, ButtonModule,DropdownModule],
  standalone:true
})
export class ModifyOrderModalComponent implements OnInit {
  @Output() orderUpdated: EventEmitter<Order> = new EventEmitter<Order>();
  order: Order;
  statusOptions: Status[] = [];
  paymentMethods: any[] = [];
  sizePrices: any[] = [];
  selectedStatus: Status | undefined; // Added definite assignment assertion
  selectedSize: any;
  selectedPaymentMethod: any;
  select: string = ''; 
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private statusService : StatusService, private cdr: ChangeDetectorRef, 
    private paymentService : PaymentService, private orderService: OrderService, private messageService: MessageService
  ) {
    this.order = { ...this.config.data.order };
    this.order.DeliveryCost = (this.order.DeliveryCost / 100);
    console.log(this.order)
  }

  ngOnInit(): void {
    // Fetch status options when the component initializes
    this.statusService.getAllStatuses().subscribe(
      (statuses: Status[]) => {
        this.statusOptions = statuses;
        console.log('Statuses:', statuses);  
        this.setInitialStatus();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching status options:', error);
      }
    );
    this.paymentService.getAllPaymentMethods().subscribe(
      (methods: any[]) => {
        this.paymentMethods = methods;
        console.log('Payment Methods:', methods);
        this.setInitialPaymentMethod();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching payment methods:', error);
      }
    );
    // Fetch size prices
    this.paymentService.getSizePrices().subscribe(
      (prices: any[]) => {
        this.sizePrices = prices;
        console.log('Size Prices:', prices);
        this.setInitialSize();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching size prices:', error);
      }
    );
  }
  setInitialStatus() {
    this.selectedStatus = this.statusOptions.find(status => status.StatusName === this.order.StatusName);
    console.log('Selected Status:', this.selectedStatus);
  }
  setInitialPaymentMethod() {
      this.selectedPaymentMethod = this.paymentMethods.find(method => method.PaymentName === this.order.PaymentMethodName);
      console.log('Selected Payment Method:', this.selectedPaymentMethod);
  }
  setInitialSize() {
      this.selectedSize = this.sizePrices.find(size => size.Size === this.order.ChamberSize);
      console.log('Selected Size Price:', this.selectedSize);
  }
  save() {
    this.order.DeliveryCost = this.order.DeliveryCost*100;
    this.orderService.updateOrder(this.order).subscribe(
      (response) => {
        // Success message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order updated successfully'
        });
        this.orderUpdated.emit(this.order);
        this.ref.close();
      },
      (error) => {
        // Error message
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update order. Please try again later.'
        });
      }
    );
  }
  onStatusChange(event: any) {
    this.order.StatusName = event.value.StatusName; 
  }
  onSizeChange(event: any) {;
    this.order.ChamberSize = event.value.Size; 
  }
  onPaymentChange(event: any) {
    this.order.PaymentMethodName = event.value.PaymentName;
  }
}