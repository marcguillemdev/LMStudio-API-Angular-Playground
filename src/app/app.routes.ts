import { Routes } from '@angular/router';

const titlePrefix = 'LMStudio Playground: ';

export const routes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'home', title: titlePrefix + 'Home', loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent) },
  { path: 'chat', title: titlePrefix + 'Chat', loadComponent: () => import('./components/chat/chat.component').then(c => c.ChatComponent) }
];
