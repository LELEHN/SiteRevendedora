import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Adm } from './adm/adm';
import { PagamentosComponent } from './pagamentos/pagamentos';
import { GerenciarProdutosComponent } from './gerenciar-produtos/gerenciar-produtos';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'login', component: Login},
    {path: 'adm', component: Adm},
    {path: 'pagamentos', component: PagamentosComponent},
    {path: 'gerenciar-produtos', component: GerenciarProdutosComponent}
];
