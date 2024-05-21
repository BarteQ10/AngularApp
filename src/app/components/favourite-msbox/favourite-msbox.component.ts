import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { FavouriteMsboxModalComponent } from '../favourite-msbox-modal/favourite-msbox-modal.component';
import { MachineService } from '../../services/machine.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FavouriteService } from '../../services/favourite.service';

@Component({
  selector: 'app-favourite-msbox',
  standalone: true,
  imports: [TableModule, DialogModule, CommonModule, ButtonModule],
  templateUrl: './favourite-msbox.component.html',
  styleUrl: './favourite-msbox.component.css',
  providers: [DialogService]
})
export class FavouriteMSBOXComponent {
  favoriteMachines : any[] = [];
  hovered : boolean = false;
  constructor(private dialogService: DialogService, private machineService: MachineService, private favoriteService: FavouriteService) { 
    this.loadFavoriteMachines();
  }
  loadFavoriteMachines() {
    this.machineService.getAllMachines().subscribe(
      (machines: any[]) => {
        this.favoriteMachines = machines.filter(machine => machine.IsFav);
      },
      (error) => {
        console.error('Error occurred while fetching machines:', error);
      }
    );
  }
  openModal() {
    const ref = this.dialogService.open(FavouriteMsboxModalComponent, {
      header: 'Add Favourite',
      width: '70%',
      contentStyle: { 'max-height': '350px', 'overflow': 'auto' }
    });
    ref.onClose.subscribe(() => {
      // Reload favorite machines after modal is closed
      this.loadFavoriteMachines();
    });
  }
  getColumns(): string[] {
    if (this.favoriteMachines.length > 0) {
      const allColumns = Object.keys(this.favoriteMachines[0]);
      return allColumns.filter(col => !['Id', 'IdMachineType', 'Latitude', 'Longitude'].includes(col));
    }
    return [];
  }
  toggleFavourite(machineId: number): void {
    // Toggle the favorite status locally
    const machine = this.favoriteMachines.find(item => item['Id'] === machineId);
    // Call the service method to remove or add the machine from/to favorites
    if (machine['IsFav']) {
        this.removeFavouriteMachine(machineId);
    } else {
        this.addFavouriteMachine(machineId);
    }
    if (machine) {
      machine['IsFav'] = !machine['IsFav']; // Toggle the IsFav property
  }
}

addFavouriteMachine(machineId: number): void {
    this.favoriteService.addFavouriteMachine(machineId).subscribe(
        () => {
            console.log('Machine added to favorites successfully.');
        },
        (error) => {
            console.error('Error occurred while adding machine to favorites:', error);
            // Revert the local change if an error occurs
            const machine = this.favoriteMachines.find(item => item['Id'] === machineId);
            if (machine) {
                machine['IsFav'] = !machine['IsFav'];
            }
        }
    );
}

removeFavouriteMachine(machineId: number): void {
    this.favoriteService.removeFavouriteMachine(machineId).subscribe(
        () => {
            console.log('Machine removed from favorites successfully.');
        },
        (error) => {
            console.error('Error occurred while removing machine from favorites:', error);
            // Revert the local change if an error occurs
            const machine = this.favoriteMachines.find(item => item['Id'] === machineId);
            if (machine) {
                machine['IsFav'] = !machine['IsFav'];
            }
        }
    );
}
}
