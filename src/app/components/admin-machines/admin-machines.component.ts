import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { MachineService } from '../../services/machine.service';
import { Machine } from '../../interfaces/machine';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-admin-machines',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, CheckboxModule,
    MultiSelectModule, FormsModule, DialogModule, InputTextModule],
  templateUrl: './admin-machines.component.html',
  styleUrl: './admin-machines.component.css',
})
export class AdminMachinesComponent implements OnInit {

  machines: Machine[] = [];
  columnOptions: any[];
  selectedColumns: any[];
  displayEditModal: boolean = false;
  selectedMachine: Machine = { Id: 0, Address: '', PostalCode: '', Location: '', Country: '', IsMobile: false };
  constructor(private machineService: MachineService, private messageService: MessageService) {
    this.columnOptions = [
      { label: 'Id', field: 'Id', header: 'Id' },
      { label: 'Address', field: 'Address', header: 'Address' },
      { label: 'PostalCode', field: 'PostalCode', header: 'Postal Code' },
      { label: 'Location', field: 'Location', header: 'Location' },
      { label: 'Country', field: 'Country', header: 'Country' },
    ];

    let storedColumns = localStorage.getItem('selectedColumnsAdminMachines');
    if (!storedColumns) {
      storedColumns = JSON.stringify(this.columnOptions.slice(0, 5).map(option => option)); // Ustaw pierwsze pięć kolumn
      localStorage.setItem('selectedColumnsAdminMachines', storedColumns);
    }

    this.selectedColumns = JSON.parse(storedColumns);
  }
  ngOnInit(): void {
    this.refreshMachines();
  }
  refreshMachines(): void {
    this.machineService.getAllMachines().subscribe(
      (machines: Machine[]) => {
        this.machines = machines;
      },
      (error) => {
      }
    );
  }
  onColumnToggle(event: any): void {
    this.selectedColumns = event.value;
    localStorage.setItem('selectedColumnsAdminMachines', JSON.stringify(this.selectedColumns));
  }
  showEditModal(machine: Machine): void {
    this.selectedMachine = { ...machine };
    this.displayEditModal = true;
  }

  saveMachine(): void {
    if (this.selectedMachine) {
      this.machineService.updateMachine(this.selectedMachine).subscribe(
        () => {
          this.displayEditModal = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Machine updated successfully' });
          this.refreshMachines();
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update machine' });
        }
      );
    }
  }
}