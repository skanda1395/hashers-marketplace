import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { SellComponent } from './components/sell/sell.component';
import { ItemsComponent } from './components/items/items.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    title: "Hashers Marketplace | Login"
  },
  {
    path: "register",
    component: RegisterComponent,
    title: "Hashers Marketplace | Register"
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    title: "Hashers Marketplace | Dashboard",
    canActivate: [authGuard]
  },
  {
    path: "transactions",
    component: TransactionsComponent,
    title: "Hashers Marketplace | Transactions",
    canActivate: [authGuard]
  },
  {
    path: "items",
    component: ItemsComponent,
    title: "Hashers Marketplace | My Items",
    canActivate: [authGuard]
  },
  {
    path: '**', redirectTo: 'dashboard', pathMatch: 'full'
  }
];
