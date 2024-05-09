import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { AboutComponent }from './components/about/about.component';
import { SuspendAccountComponent } from './components/suspend-account/suspend-account.component';
import { OrdersComponent } from './components/orders/orders.component';
import { FavouriteMSBOXComponent } from './components/favourite-msbox/favourite-msbox.component';
import { ChangeUserDataComponent } from './components/change-user-data/change-user-data.component';
import { SendParcelComponent } from './components/send-parcel/send-parcel.component';
import { ParcelReturnsComponent } from './components/parcel-returns/parcel-returns.component';
import { AdminMachinesComponent } from './components/admin-machines/admin-machines.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';

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
        component: RegisterComponent
    },
    {
        path: 'machinesAdmin',
        component: AdminMachinesComponent
    },
    {
        path: 'ordersAdmin',
        component: AdminOrdersComponent
    },
    {
        path: 'usersAdmin',
        component: AdminUsersComponent
    },
    {
        path: 'suspendAccount',
        component: SuspendAccountComponent
    },
    {
        path: 'orders',
        component: OrdersComponent
    },
    {
        path: 'favouriteMSBox',
        component: FavouriteMSBOXComponent
    },
    {
        path: 'changeUserData',
        component: ChangeUserDataComponent
    },
    {
        path: 'sendParcel',
        component: SendParcelComponent
    },
    {
        path: 'yourReturns',
        component: ParcelReturnsComponent
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
