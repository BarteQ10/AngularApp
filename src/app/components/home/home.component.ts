import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, [NgFor], FlexLayoutModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService){

  }
  cardItems: any[] = [];
  isAdmin: boolean = false;
  navigateTo(page: string) {
    this.router.navigate([page]);
    console.log('Navigating to', page);
  }
  ngOnInit(): void {
    const userRole = this.authService.getUserRole();
    if (userRole === 'Client') {
      this.isAdmin = false;
      this.cardItems = [
        // Client menu items
        { title: 'Orders', description: 'Opis Kategorii ', icon: 'pi pi-fw pi-home', route: '/orders' },
        { title: 'Favourite MSBox', description: 'Opis Kategorii ', icon: 'pi pi-user', route: '/favouriteMSBox' },
        { title: 'Change User Data', description: 'Opis Kategorii ', icon: 'pi pi-cog', route: '/changeUserData' },
        { title: 'Send Parcel ', description: 'Opis Kategorii ', icon: 'pi pi-chart-bar', route: '/sendParcel' },
        { title: 'Suspend Account', description: 'Opis Kategorii ', icon: 'pi pi-globe', route: '/suspendAccount' }
      ];
    } else if (userRole === 'Admin') {
      this.isAdmin = true;
      this.cardItems = [
        // Admin menu items
        { title: 'Orders', description: 'Opis Kategorii ', icon: 'pi pi-chart-bar', route: '/ordersAdmin' },
        { title: 'Machines', description: 'Opis Kategorii ', icon: 'pi pi-file-text', route: '/machinesAdmin' },
        { title: 'Users', description: 'Opis Kategorii ', icon: 'pi pi-file-text', route: '/usersAdmin' },
        { title: 'Change User Data', description: 'Opis Kategorii ', icon: 'pi pi-cog', route: '/changeUserData' },
        { title: 'Suspend Account', description: 'Opis Kategorii ', icon: 'pi pi-globe', route: '/suspendAccount' }
      ];
    } else {
      // Handle unknown or unauthorized roles
    }
  }
}
