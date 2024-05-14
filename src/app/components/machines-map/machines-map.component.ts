import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { ChangeDetectorRef } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { MachineService } from '../../services/machine.service';
import { identity } from 'rxjs';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-machines-map',
  standalone: true,
  imports: [GoogleMapsModule, ButtonModule],
  templateUrl: './machines-map.component.html',
  styleUrls: ['./machines-map.component.css'],
  providers:[DialogService]
})
export class MachinesMapComponent {
  @Input() machineSize: string | '';
  @Output() machinesSelected = new EventEmitter<{ machineIdFrom: number | null, machineIdTo: number | 
    null, machineLabelFrom: string |null, machineLabelTo: string |null}>();
  config = inject(DynamicDialogConfig);
  machineFromAddress: string = ''; 
  machineToAddress: string = '';
  machineFromId: number = 0; 
  machineToId: number = 0;
  machineLabelFrom: string = ''; // Dodano etykietę maszyny From
  machineLabelTo: string = '';
  cameraLat:number = 0;
  cameraLng:number = 0;
  newFrom: boolean = false;
  newTo: boolean = false;
  markers: any[] = [];
  tempMarker: google.maps.Marker | undefined;
  map: google.maps.Map | undefined;
  constructor(private ref: DynamicDialogRef, private cd: ChangeDetectorRef,
    private userService: UserService,
    private machineService: MachineService, private dialogService: DialogService) {
    this.machineSize = this.config.data.machineSize
    this.userService.getUserData().subscribe(
      (userData: Partial<any>) => {
        this.cameraLat=userData['Latitude']
        this.cameraLng=userData['Longitude']
        console.log(this.cameraLat)
        console.log(this.cameraLng)
        if (this.cameraLat !== 0 || this.cameraLng !== 0) {
          this.tempMarker = new google.maps.Marker({
            position: { lat: this.cameraLat-0.001, lng: this.cameraLng },
            map: this.map, // Assuming this.map is initialized elsewhere
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new google.maps.Size(40, 40)
            }
          });
      
          // Set tempMarker position to current coordinates
          this.tempMarker.setPosition({ lat: this.cameraLat-0.001, lng: this.cameraLng });
          this.center = {
            lat: this.cameraLat,
            lng: this.cameraLng
          };
          this.initMapAndMarkers();
        }
      }
    )

  }
  
  infoWindows: google.maps.InfoWindow[] = [];
  center: google.maps.LatLngLiteral = {
    lat: this.cameraLat,
    lng: this.cameraLng
  };
  zoom = 13;

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }
  initMapAndMarkers() {
    this.machineService.getMachinesBySize(this.config.data.machineSize).subscribe(
      (machines: any[]) => {
        this.markers = machines.map(machine => ({
          position: {
            lat: machine.Latitude,
            lng: machine.Longitude
          },
          label: `${machine.Address}, ${machine.Location}`,
          id: machine.Id,
          postalCode: machine.PostalCode
          // Add more properties as needed for the marker popup
        }));

        this.handleMapInitialized(this.map);
      },
      (error) => {
        console.error('Error occurred while fetching machines:', error);
      }
    );
  }
  handleMapInitialized(map?: google.maps.Map) {
    console.log('markerInfo');
    this.map = map; 
    
    if (this.tempMarker) {
      let tempPosition = this.tempMarker.getPosition() as google.maps.LatLng;
    
      this.markers.forEach((markerInfo: any, index) => {
        console.log(markerInfo)
        const marker = new google.maps.Marker({
          position: markerInfo.position,
          map: map,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Setting color to blue
            scaledSize: new google.maps.Size(40, 40) // Setting icon size
          },
          title: ''+markerInfo.id
        });
    
        const contentString = `
          <div class="info-window-content" style="color:black;">
            <p>Nazwa: ${markerInfo.label}</p>
            <p>Współrzędne: (${markerInfo.position.lat}, ${markerInfo.position.lng})</p>
          </div>
        `;
        const infoWindow = new google.maps.InfoWindow({
          content: contentString
        });
    
        marker.addListener('click', () => {
          const markerPosition = marker.getPosition();
          this.setFrom(marker.getTitle() || null);
          this.setTo(marker.getTitle() || null);
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
      this.machineFromId = parseInt(marker, 10); 
      this.machineLabelFrom = this.getLabelFromId(this.machineFromId);
      console.log("machineFromId:", this.machineFromId);
      this.newFrom = false;
      this.cd.detectChanges();
    }
  }

  async setTo(marker: string | null) {
    if (marker && this.newTo) {
      this.machineToAddress = marker;
      this.machineToId = parseInt(marker, 10);
      this.machineLabelTo = this.getLabelFromId(this.machineToId);
      console.log("machineToId:", this.machineToId);
      this.newTo = false;
      this.cd.detectChanges();
    }
  }
  selectMachines(){
    const emittedData = {
      machineIdFrom: this.machineFromId,
      machineLabelFrom: this.machineLabelFrom,
      machineIdTo: this.machineToId,
      machineLabelTo: this.machineLabelTo
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
  getLabelFromId(id: number): string {
    const marker = this.markers.find(marker => marker.id === id);
    return marker ? marker.label : '';
  }
}