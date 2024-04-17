import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { AboutComponent }from './components/about/about.component';

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
        component: AboutComponent
    },
    {
        path: 'services', 
        component: AboutComponent
    },
    {
        path: 'about', 
        component: AboutComponent
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
