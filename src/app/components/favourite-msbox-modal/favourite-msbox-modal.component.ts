import { ChangeDetectorRef, Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from '../../services/user.service';
import { MachineService } from '../../services/machine.service';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { FavouriteService } from '../../services/favourite.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-favourite-msbox-modal',
  standalone: true,
  imports: [GoogleMapsModule, ButtonModule],
  templateUrl: './favourite-msbox-modal.component.html',
  styleUrl: './favourite-msbox-modal.component.css'
})
export class FavouriteMsboxModalComponent {
  machineFavouriteAddress: string = ''; 
  machineFavouriteId: number = 0; 
  machineLabelFavourite: string = ''; // Dodano etykietę maszyny From
  cameraLat:number = 0;
  cameraLng:number = 0;
  newFavourite: boolean = false;
  markers: any[] = [];
  tempMarker: google.maps.Marker | undefined;
  map: google.maps.Map | undefined;
  constructor(private ref: DynamicDialogRef, private cd: ChangeDetectorRef,
    private userService: UserService,
    private machineService: MachineService, 
    private messageService: MessageService,
    private authService : AuthService,
    private favoriteService : FavouriteService) {
    const userId = this.authService.getUserId(sessionStorage.getItem('jwt_token') || '')
    this.userService.getUserData(userId).subscribe(
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
    this.machineService.getAllMachines().subscribe(
      (machines: any[]) => {
        this.markers = machines.map(machine => ({
          position: {
            lat: machine.Latitude,
            lng: machine.Longitude
          },
          label: `${machine.Address}, ${machine.Location}`,
          id: machine.Id,
          postalCode: machine.PostalCode,
          isFav: machine.IsFav
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
        const marker = new google.maps.Marker({
          position: markerInfo.position,
          map: map,
          icon: {
            url: markerInfo.isFav ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
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
          this.setFrom(marker.getTitle() || null);
        });
        marker.addListener('dblclick', () => {const markerPosition = marker.getPosition();
          this.setFrom(marker.getTitle() || null);
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
    
        this.infoWindows.push(infoWindow);
      });
    }
  }
  setNewFavourite(){
    this.newFavourite=true;
  }

  async setFrom(marker: string | null) {
    if (marker && this.newFavourite) {
      this.machineFavouriteAddress = marker;
      this.machineFavouriteId = parseInt(marker, 10); 
      this.machineLabelFavourite = this.getLabelFromId(this.machineFavouriteId);
      console.log("machineFromId:", this.machineFavouriteId);
      this.addFavouriteMachine(this.machineFavouriteId);
      this.newFavourite = false;
      this.cd.detectChanges();
    }
  }

  addFavouriteMachine(machineId: number): void {
    this.favoriteService.addFavouriteMachine(machineId).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Machine added to favorites successfully.' }); // Display success message
        this.updateMarkerIcon(machineId, 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'); // Change marker icon to red
      },
      (error) => {
        console.error('Error occurred while adding machine to favorites:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error occurred while adding machine to favorites.' }); // Display error message
      }
    );
  }
  
  updateMarkerIcon(machineId: number, iconUrl: string): void {
    const marker = this.markers.find(marker => marker.id === machineId);
    if (marker && this.map) {
      const mapMarker = new google.maps.Marker({
        position: marker.position,
        map: this.map,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(40, 40)
        },
        title: '' + marker.id
      });
      mapMarker.setMap(this.map);
    }
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
