import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { User } from '../../interfaces/auth';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, CheckboxModule, MultiSelectModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {

  users: User[] = []; 
  columnOptions: any[]; // Opcje kolumn
  selectedColumns: any[]; // Wybrane kolumny
  constructor(private userService: UserService) {
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
}