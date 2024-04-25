import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog'; // Import for p-dialog component
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-suspend-account',
  standalone: true,
  imports: [DialogModule, ButtonModule], // Add DialogModule to imports
  templateUrl: './suspend-account.component.html',
  styleUrls: ['./suspend-account.component.css']
})
export class SuspendAccountComponent {
  showSuspendModal = false; // Flag to control modal visibility
  constructor(private authService: AuthService, private messageService: MessageService, private router: Router){}
  openSuspendModal(): void {
    this.showSuspendModal = true;
  }

  suspendAccount(): void {
    if (this.authService) { // Ensure authService is defined
      this.authService.disableUser().subscribe(() => {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'User suspended' });
      }, (error: Error) => { // Explicitly specify the type of 'error' parameter
        console.error('Error disabling user:', error);
        // Handle error accordingly
      });
    } else {
      console.error('AuthService is undefined');
      // Handle the case where AuthService is not properly injected
    }
    this.showSuspendModal = false;
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}