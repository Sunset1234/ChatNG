import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Guards/auth.guard';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
  {
    path:'',
    component:InicioComponent
  },
  {
    path:'login',
    component:LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'chat',
    component: ChatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'registro',
    component: RegistroComponent,
    canActivate: [AuthGuard]
    // canActivate
  },
  {
    path:'**',
    component:LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
