import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, MenubarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  constructor(private router: Router){}
  items: MenuItem[] = [
    {label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/'},
      {label: 'About', icon: 'pi pi-fw pi-info', routerLink: '/about'},
      {label: 'Services', icon: 'pi pi-fw pi-cog', routerLink: '/services'},
      {label: 'Contact', icon: 'pi pi-fw pi-envelope', routerLink: '/contact'}
  ];
  logOut(){
    sessionStorage.clear();
    this.router.navigate(['login'])
  }
}
