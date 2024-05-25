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
import { ChartModule } from 'primeng/chart';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [TableModule, CommonModule, KnobModule, FormsModule,ButtonModule, FlexLayoutModule, ChartModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',

})
export class ReportComponent implements OnInit {
  reportData: ChamberData[] = [];
  showTable: boolean = true;
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  options: ChartOptions = {};
  constructor(private machineService: MachineService,private messageService : MessageService) { }
  

  // Method to toggle between showing table and chart
  toggleView() {
      this.showTable = !this.showTable;
  }
  ngOnInit(): void {
    this.loadReportData();
    this.initializeChartOptions();
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
      this.updateChartData();
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
  unAssignMachineFrom(machine_id:number, id_machine_type:number):void{
    this.machineService.unAssignMachineFrom(machine_id, id_machine_type).subscribe(
      (response) => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Machine unassigned successfully.'});
          this.loadReportData();
      },
      (error) => {
          this.messageService.add({severity:'error', summary:'Error', detail:'Failed to unassign machine.'});
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
  updateChartData(): void {
    const labels = this.reportData.map(item => `${item.Id}`);
    const emptyChambers = this.reportData.map(item => typeof item.EmptyChambers === 'number' ? item.EmptyChambers : 0);
    const occupiedChambers = this.reportData.map(item => typeof item.OccupiedChambers === 'number' ? item.OccupiedChambers : 0);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Empty Chambers',
          data: emptyChambers,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Occupied Chambers',
          data: occupiedChambers,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
}

  initializeChartOptions(): void {
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Machine ID',
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Chambers',
          },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false
      },
      },
    };
  }
}
