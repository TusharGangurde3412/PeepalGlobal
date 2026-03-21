import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { QuoteComponent } from './components/quote/quote.component';
import { AdminComponent } from './components/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/login/login.component';
import { SellerComponent } from './components/seller/seller.component';
import { sellerGuard } from './guards/seller.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'quote', component: QuoteComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'seller', component: SellerComponent, canActivate: [sellerGuard] },
  { path: 'inquiry', redirectTo: 'quote' },
  { path: '**', redirectTo: '' }
];
