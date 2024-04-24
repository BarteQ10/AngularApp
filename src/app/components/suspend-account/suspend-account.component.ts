import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog'; // Import for p-dialog component

@Component({
  selector: 'app-suspend-account',
  standalone: true,
  imports: [DialogModule, ButtonModule], // Add DialogModule to imports
  templateUrl: './suspend-account.component.html',
  styleUrls: ['./suspend-account.component.css']
})
export class SuspendAccountComponent {
  showSuspendModal = false; // Flag to control modal visibility

  openSuspendModal(): void {
    this.showSuspendModal = true;
  }

  suspendAccount(): void {
    // Implement account suspension logic here
    // ...

    this.showSuspendModal = false;
  }
}