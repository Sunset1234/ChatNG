import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [
  {
    path:'chat', 
    component: ChatComponent},
  {
    path: 'registro',
    component: RegistroComponent,
    // canActivate
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
