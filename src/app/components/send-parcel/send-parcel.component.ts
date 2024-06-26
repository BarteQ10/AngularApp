import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { MachinesMapComponent } from '../machines-map/machines-map.component';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-send-parcel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, InputNumberModule, DialogModule, FlexLayoutModule],
  providers: [DialogService],
  templateUrl: './send-parcel.component.html',
  styleUrl: './send-parcel.component.css'
})
export class SendParcelComponent implements OnInit {
  selectedMachines: { machineIdFrom: number | null, machineIdTo: number | null } = { machineIdFrom: null, machineIdTo: null };
  packageForm!: FormGroup;
  selectedSize: string | null = null;
  selectedPaymentMethodId: number | null = null;
  machineLabelFrom:string | null = null;
  machineLabelTo:string | null = null;
  sizesWithPrices: any[] = [];
  handleMachinesSelected(event: { machineIdFrom: number | null, machineIdTo: number | null }) {
    this.selectedMachines = event;
  }
  paymentMethods: any[] = [];
  constructor(private dialogService: DialogService, 
    private fb: FormBuilder, private orderService: OrderService, 
    private messageService: MessageService, private authService: AuthService,
    private paymentService: PaymentService) { }

  ngOnInit(): void {
    
    this.packageForm = this.fb.group({
      SenderMail: [sessionStorage.getItem('email' || '')],
      ReceiverMail: ['', Validators.required],
      PaymentMethodId: ['', Validators.required],
      Description: ['', Validators.required],
      MachineIdFrom: ['', Validators.required],
      MachineIdTo: ['', Validators.required],
      Size: ['', Validators.required]
    });
    this.paymentService.getAllPaymentMethods().subscribe(
      (methods: any[]) => {
        this.paymentMethods = methods;
      },
      (error) => {
        console.error('Error occurred while fetching payment methods:', error);
      }
    );
    this.paymentService.getSizePrices().subscribe(
      (sizesWithPrices: any[]) => {
        this.sizesWithPrices = sizesWithPrices;
      },
      (error) => {
        console.error('Error occurred while fetching size prices:', error);
      }
    );
  }
  getPaymentIcon(paymentId: number): string {
    switch (paymentId) {
      case 1:
        return 'pi-credit-card';
      case 2:
        return 'pi-building-columns';
      case 3:
        return 'pi-mobile';
      default:
        return '';
    }
  }

  selectPaymentMethod(paymentId: number) {
    this.selectedPaymentMethodId = paymentId;
    this.packageForm.get('PaymentMethodId')?.setValue(paymentId);
  }
  showParcelModal() {
    const ref = this.dialogService.open(MachinesMapComponent, {
      header: 'Select Machines',
      width: '80%',
      data: {
        machineSize: this.selectedSize
      }
    });
  
    ref.onClose.subscribe((machinesSelected: { machineIdFrom: number | null, machineIdTo: number | null, 
      machineLabelFrom: string |null, machineLabelTo: string |null }) => {
      console.log(machinesSelected);
      if (machinesSelected) {
        this.packageForm.get('MachineIdFrom')?.setValue(machinesSelected.machineIdFrom); // Ustaw machineIdFrom w formularzu
        this.packageForm.get('MachineIdTo')?.setValue(machinesSelected.machineIdTo); // Ustaw machineIdTo w formularzu
        this.machineLabelFrom = machinesSelected.machineLabelFrom;
        this.machineLabelTo = machinesSelected.machineLabelTo;
      }
    });
  }
  submitForm() {
    if (this.packageForm.valid) {
      this.orderService.createOrder(this.packageForm.value)
      .subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Send successful' });
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Send error' });
        }
      );
  } else {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid order form' });
  }
  }
  selectSize(size : string){
    this.selectedSize = size;
    this.packageForm.get('Size')?.setValue(size);

    const selectedSizePrice = this.sizesWithPrices.find(item => item.Size === size)?.Price;
    if (selectedSizePrice !== undefined) {
      // Zaktualizuj cenę w widoku
      const priceElement = document.getElementById('price');
      if (priceElement) {
        priceElement.innerText = `$${selectedSizePrice.toFixed(2)}`;
      }
    }
  }
  getSizeHeader(size: string): string {
    switch (size) {
      case 'S':
        return 'Small';
      case 'M':
        return 'Medium';
      case 'L':
        return 'Large';
      default:
        return '';
    }
  }
}