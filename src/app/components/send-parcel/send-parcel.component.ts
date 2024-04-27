import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { OrderService } from '../../services/order.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { MachinesLeafletComponent } from '../machines-leaflet/machines-leaflet.component';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-send-parcel',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, InputNumberModule, DialogModule],
  providers: [DialogService],
  templateUrl: './send-parcel.component.html',
  styleUrl: './send-parcel.component.css'
})
export class SendParcelComponent implements OnInit {
  packageForm!: FormGroup;

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
  showParcelModal() {
    const ref = this.dialogService.open(MachinesLeafletComponent, {
      header: 'Parcel Modal',
      width: '70%'
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
}