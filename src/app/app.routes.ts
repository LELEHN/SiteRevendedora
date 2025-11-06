import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Adm } from './adm/adm';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'login', component: Login},
    {path: 'adm', component: Adm}
];
