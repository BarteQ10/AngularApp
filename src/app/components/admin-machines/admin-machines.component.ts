import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { MachineService } from '../../services/machine.service';
import { Machine } from '../../interfaces/machine';


@Component({
  selector: 'app-admin-machines',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, CheckboxModule, MultiSelectModule, FormsModule],
  templateUrl: './admin-machines.component.html',
  styleUrl: './admin-machines.component.css'
})
export class AdminMachinesComponent implements OnInit {

  machines: Machine[] = []; 
  columnOptions: any[]; // Opcje kolumn
  selectedColumns: any[]; // Wybrane kolumny
  constructor(private machineService: MachineService) {
    this.columnOptions = [
      { label: 'Id', field: 'Id', header: 'Id' },
      { label: 'Address', field: 'Address', header: 'Address' },
      { label: 'PostalCode', field: 'PostalCode', header: 'Postal Code' },
      { label: 'Location', field: 'Location', header: 'Location' },
      { label: 'Country', field: 'Country', header: 'Country' },
      { label: 'IsMobile', field: 'IsMobile', header: 'Is Mobile' }
  ];

  let storedColumns = localStorage.getItem('selectedColumnsAdminMachines');
    if (!storedColumns) {
        storedColumns = JSON.stringify(this.columnOptions.slice(0, 5).map(option => option)); // Ustaw pierwsze pięć kolumn
        localStorage.setItem('selectedColumnsAdminMachines', storedColumns);
    }

    this.selectedColumns = JSON.parse(storedColumns);
   } 
  ngOnInit(): void {
    this.machineService.getAllMachines().subscribe(
      (orders: Machine[]) => {
        this.machines = orders; 
      },
      (error) => {
        console.error('Błąd podczas pobierania zamówień:', error);
      }
    );
  }
  onColumnToggle(event: any): void {
    this.selectedColumns = event.value;
    localStorage.setItem('selectedColumnsAdminMachines', JSON.stringify(this.selectedColumns));
}
}