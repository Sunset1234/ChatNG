import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Servicios/auth.service';
import * as conexion from '../Clases/url';
import Ws from '@adonisjs/websocket-client';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  //reactive forms
  form = new FormGroup({
    nickname: new FormControl('',
    [
      Validators.required,
      Validators.minLength(2),
    ]),
    password: new FormControl('',
    [
      Validators.required,
      Validators.minLength(6)
    ])
  });


  //Conexión WebSocket
  socket = Ws(conexion.url_websocket);
  constructor(private router: Router,private service: AuthService,private _Router:Router) { }

  ngOnInit() {

    //Conectar y Subscribir
    this.socket = this.socket.connect();
    this.socket.subscribe('Contactos');
  }

  IniciarSesion(){
    this._Router.navigate(['/login']);
  }

  crear() {

    //Canal de contactos
    const Contactos = this.socket.getSubscription('Contactos');

    //Datos de formulario
    var { nickname, password } = this.form.value;

    this.service.crearUser(nickname, password).subscribe(data => {

      Contactos.emit('message', data);
      this.router.navigate(['/']);

    });

  }

  ngOnDestroy(): void {
    this.socket.close();
  }

}
