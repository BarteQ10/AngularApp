import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { User } from '../../interfaces/auth';
import { UserService } from '../../services/user.service';
import { ChangeUserDataComponent } from '../change-user-data/change-user-data.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    templateUrl: './admin-users.component.html',
    styleUrl: './admin-users.component.css',
    imports: [TableModule, CommonModule, ButtonModule, CheckboxModule,
       MultiSelectModule, FormsModule, ChangeUserDataComponent],
    providers: [DialogService]
})
export class AdminUsersComponent implements OnInit {
  @ViewChild(ChangeUserDataComponent) changeUserDataModal!: ChangeUserDataComponent;
  users: User[] = [];
  columnOptions: any[]; // Opcje kolumn
  selectedColumns: any[]; // Wybrane kolumny
  constructor(private userService: UserService, private dialogService: DialogService) {
    this.columnOptions = [
      { label: 'Id', field: 'Id', header: 'Id' },
      { label: 'Mail', field: 'Mail', header: 'Mail' },
      { label: 'Password', field: 'Password', header: 'Password' },
      { label: 'Active', field: 'Active', header: 'Active' }
    ];

    let storedColumns = localStorage.getItem('selectedColumnsAdminUsers');
    if (!storedColumns) {
      storedColumns = JSON.stringify(this.columnOptions.slice(0, 5).map(option => option)); // Ustaw pierwsze pięć kolumn
      localStorage.setItem('selectedColumnsAdminUsers', storedColumns);
    }

    this.selectedColumns = JSON.parse(storedColumns);
  }
  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      (orders: User[]) => {
        this.users = orders;
      },
      (error) => {
        console.error('Błąd podczas pobierania zamówień:', error);
      }
    );
  }
  onColumnToggle(event: any): void {
    this.selectedColumns = event.value;
    localStorage.setItem('selectedColumnsAdminUsers', JSON.stringify(this.selectedColumns));
  }
  openModal(user: User): void {
    const ref = this.dialogService.open(ChangeUserDataComponent, {
      header: 'Change User Data',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      data: {
        userId: user.Id // przekazanie użytkownika do modala
      }
    });

    // Pass any required data to the modal component if needed
    ref.onClose.subscribe(() => {
      // Handle modal close if needed
    });
  }

  openModalFromButton(user: User): void {
    // Open the modal when the button is clicked
    this.openModal(user);
  }
}