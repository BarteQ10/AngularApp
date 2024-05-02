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

@Component({
  selector: 'app-send-parcel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, InputNumberModule, DialogModule],
  providers: [DialogService],
  templateUrl: './send-parcel.component.html',
  styleUrl: './send-parcel.component.css'
})
export class SendParcelComponent implements OnInit {
  selectedMachines: { machineIdFrom: number | null, machineIdTo: number | null } = { machineIdFrom: null, machineIdTo: null };
  packageForm!: FormGroup;
  selectedSize: string | null = null;
  selectedPaymentMethodId: number | null = null;
  handleMachinesSelected(event: { machineIdFrom: number | null, machineIdTo: number | null }) {
    // Zapisz wybrane maszyny
    this.selectedMachines = event;
  }
  paymentMethods: any[] = [
    { Id: 1, PaymentName: 'Karta płatnicza' },
    { Id: 2, PaymentName: 'Przelew' },
    { Id: 3, PaymentName: 'BLIK' }
  ];
  constructor(private dialogService: DialogService, private fb: FormBuilder, private orderService: OrderService, private messageService: MessageService, private authService: AuthService) { }

  ngOnInit(): void {
    
    this.packageForm = this.fb.group({
      SenderId: [this.authService.getUserId(sessionStorage.getItem('jwt_token') || '')],
      ReceiverId: ['', Validators.required],
      PaymentMethodId: ['', Validators.required],
      Description: ['', Validators.required],
      MachineIdFrom: ['', Validators.required],
      MachineIdTo: ['', Validators.required],
      Size: ['', Validators.required]
    });
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
      header: 'Parcel Modal',
      width: '80%',
    });
  
    ref.onClose.subscribe((machinesSelected: { machineIdFrom: number | null, machineIdTo: number | null }) => {
      console.log(machinesSelected);
      if (machinesSelected) {
        this.packageForm.get('MachineIdFrom')?.setValue(machinesSelected.machineIdFrom); // Ustaw machineIdFrom w formularzu
        this.packageForm.get('MachineIdTo')?.setValue(machinesSelected.machineIdTo); // Ustaw machineIdTo w formularzu
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
    // Tutaj możesz dodać logikę obsługi błędów walidacji formularza
  }
  }
  selectSize(size : string){
    this.selectedSize = size;
    this.packageForm.get('Size')?.setValue(size);
  }
}