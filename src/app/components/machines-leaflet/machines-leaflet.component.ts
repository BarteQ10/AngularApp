import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, OnInit } from '@angular/core';

import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-machines-leaflet',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './machines-leaflet.component.html',
  styleUrls: ['./machines-leaflet.component.css']
})

export class MachinesLeafletComponent implements OnInit {
  constructor() {}
    
  display: any;
  points: google.maps.LatLngLiteral[] = [
    { lat: 51.801308, lng: 22.609555 }, // Existing point
    { lat: 51.805, lng: 22.61 },          // Existing point
    { lat: 51.79, lng: 22.59 },            // New point
    { lat: 51.81, lng: 22.62 },            // New point
  ];
  center: google.maps.LatLngLiteral = {
      lat: 51.801308,
      lng: 22.609555
  };
  zoom = 13;
  markerOptions: google.maps.MarkerOptions[] = [];
  markerPositions: google.maps.LatLngLiteral[] = [];

  infoWindows: google.maps.InfoWindow[] = [];

  ngOnInit() {
    this.markerOptions = this.points.map(_ => ({ draggable: false }));
  }

  moveMap(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  handleMapInitialized(map: google.maps.Map) {
    this.points.forEach((point: any, index) => {
      const marker = new google.maps.Marker({
        position: point,
        title: 'Test',
        map,
      });
  
      const contentString = `<div class="info-window-content" style="color:black;">Marker ${index + 1} Title</div>`; // Dodaj klasę do stylizacji
      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
      });
  
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
  
      this.infoWindows.push(infoWindow);
    });
  }
}
