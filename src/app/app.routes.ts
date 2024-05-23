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
    { path: '', redirectTo: '/home', pathMatch:'full' },
    { path: 'login', component: LoginComponent },
    { path: 'contact', component: AboutComponent},
    { path: 'services', component: AboutComponent  },
    { path: 'about', component: AboutComponent  },
    { path: 'register', component: RegisterComponent},
    { path: 'machinesAdmin', component: AdminMachinesComponent, canActivate: [authGuard] },
    { path: 'ordersAdmin', component: AdminOrdersComponent, canActivate: [authGuard] },
    { path: 'usersAdmin', component: AdminUsersComponent, canActivate: [authGuard] },
    { path: 'suspendAccount', component: SuspendAccountComponent, canActivate: [authGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
    { path: 'favouriteMSBox', component: FavouriteMSBOXComponent, canActivate: [authGuard] },
    { path: 'changeUserData', component: ChangeUserDataComponent, canActivate: [authGuard] },
    { path: 'sendParcel', component: SendParcelComponent, canActivate: [authGuard] },
    { path: 'yourReturns', component: ParcelReturnsComponent, canActivate: [authGuard] },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
];
