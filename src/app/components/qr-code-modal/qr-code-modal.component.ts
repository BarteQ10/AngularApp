import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-qr-code-modal',
  standalone: true,
  imports: [CommonModule, QRCodeModule],
  templateUrl: './qr-code-modal.component.html',
  styleUrl: './qr-code-modal.component.css'
})
export class QrCodeModalComponent implements OnInit {
  qrData: string ='';

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    const orderData = this.config.data.orderData;
    this.qrData = orderData; // Przypisanie danych do zmiennej qrData
  }
}
