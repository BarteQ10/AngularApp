import { Component, EventEmitter, Output } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { ChangeDetectorRef } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-machines-map',
  standalone: true,
  imports: [GoogleMapsModule, ButtonModule],
  templateUrl: './machines-map.component.html',
  styleUrls: ['./machines-map.component.css']
})
export class MachinesMapComponent {
  @Output() machinesSelected = new EventEmitter<{ machineIdFrom: number | null, machineIdTo: number | null }>();
  constructor(private ref: DynamicDialogRef, private cd: ChangeDetectorRef) {}
  machineFromAddress: string = ''; 
  machineToAddress: string = '';
  machineFromId: number = 0; 
  machineToId: number = 0;
  newFrom: boolean = false;
  newTo: boolean = false;
  infoWindows: google.maps.InfoWindow[] = [];
  points: google.maps.LatLngLiteral[] = [
    { lat: 51.801308, lng: 22.609555 },
    { lat: 51.805, lng: 22.61 },
    { lat: 51.79, lng: 22.59 },
    { lat: 51.81, lng: 22.62 }
  ];
  center: google.maps.LatLngLiteral = {
    lat: 51.801308,
    lng: 22.609555
  };
  zoom = 13;

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }

  handleMapInitialized(map: google.maps.Map) {
    const tempMarker = new google.maps.Marker({
      position: { lat: 51.800008, lng: 22.609555 }, // Ustawienie pozycji na pierwszy marker z listy
      map: map,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // Ustawienie koloru na zielony
        scaledSize: new google.maps.Size(40, 40) // Ustawienie rozmiaru ikony
      }
    });
  
    let tempPosition = tempMarker.getPosition() as google.maps.LatLng;
  
    this.points.forEach((point: any, index) => {
      const marker = new google.maps.Marker({
        position: point,
        map: map,
        title: `${index + 1}`
      });
  
      const contentString = `
        <div class="info-window-content" style="color:black;">
          <p>Nazwa: Marker ${index + 1}</p>
          <p>Współrzędne: (${point.lat}, ${point.lng})</p>
        </div>
      `;
      const infoWindow = new google.maps.InfoWindow({
        content: contentString
      });
  
      marker.addListener('click', () => {
        const markerPosition = marker.getPosition();
        this.setFrom(marker.getTitle()|| null);
        this.setTo(marker.getTitle()|| null);
        if (markerPosition && tempPosition) {
          const distance = this.calculateDistance(
            tempPosition.lat(),
            tempPosition.lng(),
            markerPosition.lat(),
            markerPosition.lng()
          );
          infoWindow.setContent(contentString + `<p style="color:black;">Odległość: ${distance.toFixed(2)} km</p>`);
          infoWindow.open(map, marker);
        }
      });
  
      this.infoWindows.push(infoWindow);
    });
  }
  setNewFrom(){
    this.newFrom=true;
  }
  setNewTo(){
    this.newTo=true;
  }
  async setFrom(marker: string | null) {
    if (marker && this.newFrom) {
      this.machineFromAddress = marker;
      this.machineFromId = parseInt(marker, 10); // Specify base 10 for parseInt
      console.log("machineFromId:", this.machineFromId);
      this.newFrom = false;
      //this.emitMachinesSelected(); // Wywołaj emitMachinesSelected bez async/await
      this.cd.detectChanges();
    }
  }

  async setTo(marker: string | null) {
    if (marker && this.newTo) {
      this.machineToAddress = marker;
      this.machineToId = parseInt(marker, 10); // Specify base 10 for parseInt
      console.log("machineToId:", this.machineToId);
      this.newTo = false;
      //this.emitMachinesSelected(); // Wywołaj emitMachinesSelected bez async/await
      this.cd.detectChanges();
    }
  }

  // emitMachinesSelected() {
  //   const emittedData = {
  //     machineIdFrom: this.machineFromId,
  //     machineIdTo: this.machineToId
  //   };
  //   console.log("Emitted data:", emittedData);
  //   this.machinesSelected.emit(emittedData);
  //   this.ref.close(emittedData);
  // }
  selectMachines(){
    const emittedData = {
      machineIdFrom: this.machineFromId,
      machineIdTo: this.machineToId
    };
    console.log("Emitted data:", emittedData);
    this.machinesSelected.emit(emittedData);
    this.ref.close(emittedData);
  }
  deleteFrom(){
    this.machineFromAddress = '';
  }

  deleteTo(){
    this.machineToAddress = '';
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Promień Ziemi w kilometrach
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}