import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, [NgFor], FlexLayoutModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router: Router){

  }
  cardItems: any[] = [
    { title: 'Orders', description: 'Opis Kategorii 1', icon: 'pi pi-fw pi-home', route: '/orders' },
    { title: 'Favourite MSBox', description: 'Opis Kategorii 2', icon: 'pi pi-user', route: '/favouriteMSBox' },
    { title: 'Change User Data', description: 'Opis Kategorii 3', icon: 'pi pi-cog', route: '/changeUserData' },
    { title: 'Send Parcel ', description: 'Opis Kategorii 4', icon: 'pi pi-chart-bar', route: '/sendParcel' },
    { title: 'Your Returns', description: 'Opis Kategorii 5', icon: 'pi pi-file-text', route: '/yourReturns' },
    { title: 'Suspend Account', description: 'Opis Kategorii 6', icon: 'pi pi-globe', route: '/suspendAccount' }
  ];
  navigateTo(page: string) {
    this.router.navigate([page]);
    console.log('Navigating to', page);
  }
  ngOnInit(): void { }
}
