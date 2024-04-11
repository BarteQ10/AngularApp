import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '', redirectTo: '', pathMatch:'full'
    },
    {
        path: 'login', 
        component:LoginComponent
    },
    {
        path: 'contact', 
        component:LayoutComponent
    },
    {
        path: 'services', 
        component:DashboardComponent
    },
    {
        path: 'about', 
        component:LayoutComponent
    },
    {
        path: 'register', 
        component:RegisterComponent
    },
    {
        path: '',
        component:HomeComponent,
        canActivate: [authGuard],
        // children:[
        //     {
        //         path:'home',
        //         component:HomeComponent
        //     }
        // ]
    },
];
