import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ChamberData, MachineFillStatusResponse } from '../../interfaces/machine';
import { KnobModule } from 'primeng/knob';
import { MachineService } from '../../services/machine.service';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [TableModule, CommonModule, KnobModule, FormsModule,ButtonModule, FlexLayoutModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',

})
export class ReportComponent implements OnInit {
  reportData: ChamberData[] = [];
  
  constructor(private machineService: MachineService,private messageService : MessageService) { }

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.machineService.getMachineFillStatus().subscribe((data: MachineFillStatusResponse[] | MachineFillStatusResponse) => {
      if (Array.isArray(data)) {
        this.reportData = data.flatMap(response => response.machines);
      } else {
        this.reportData = data.machines || [];
      }
      this.reportData.forEach(item => {
        if (typeof item.OccupiedPercentage === 'string' && item.OccupiedPercentage.length > 0) {
          item.OccupiedPercentage = +item.OccupiedPercentage.slice(0, -1);
        }
      });
    });
  }
  assignMachineTo(machine_id:number, id_machine_type:number):void{
    this.machineService.assignMachineTo(machine_id, id_machine_type).subscribe(
      (response) => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Machine assigned successfully.'});
          this.loadReportData();
      },
      (error) => {
          this.messageService.add({severity:'error', summary:'Error', detail:'Failed to assign machine.'});
      }
  );
  }
  getColumns(): string[] {
    if (this.reportData.length > 0) {
      const allColumns = Object.keys(this.reportData[0]);
      return allColumns.filter(col => !['Id', 'IdMachineType', 'Latitude', 'Longitude'].includes(col));
    }
    return [];
  }
}
