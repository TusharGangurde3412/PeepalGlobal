import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { QuoteComponent } from './components/quote/quote.component';
import { AdminComponent } from './components/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SellerComponent } from './components/seller/seller.component';
import { sellerGuard } from './guards/seller.guard';

import { ProductDetailsComponent } from './components/products/product-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Peepal Global | Best Import Export Company in India, Maharashtra',
      description: 'Peepal Global provides trusted import-export services in Maharashtra, India for global buyers and suppliers.'
    }
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: {
      title: 'Export Products | Peepal Global India',
      description: 'Browse agricultural, textile and industrial export products from Peepal Global, Maharashtra, India.'
    }
  },
  { path: 'products/:id', component: ProductDetailsComponent },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      title: 'About Us | Peepal Global',
      description: 'Learn about Peepal Global, an import-export company in Maharashtra helping businesses trade globally.'
    }
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: {
      title: 'Contact Peepal Global | Import Export India',
      description: 'Contact Peepal Global for import-export inquiries, trade support and global shipment assistance.'
    }
  },
  {
    path: 'quote',
    component: QuoteComponent,
    data: {
      title: 'Request a Quote | Peepal Global',
      description: 'Request import-export pricing and trade assistance from Peepal Global in Maharashtra, India.'
    }
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'seller', component: SellerComponent, canActivate: [sellerGuard] },
  { path: 'inquiry', redirectTo: 'quote' },
  { path: '**', redirectTo: '' }
];
