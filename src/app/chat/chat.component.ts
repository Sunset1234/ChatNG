import { Component, OnInit } from '@angular/core';
import { Mensaje } from '../Clases/mensaje';
import { ChatService } from '../Servicios/chat.service';
import { User } from '../Modelos/User';
import * as conexion from '../Clases/url';
import Ws from '@adonisjs/websocket-client';
import { Router } from '@angular/router';
import { Key } from '../Modelos/key';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  Arreglo = new Array<Mensaje>();
  mensaje: string = '';
  Usuario:User

  //Conexión WebSocket
  socket= Ws(conexion.url_websocket);
  channel: any;
  constructor(private _ChatService:ChatService,private _Router:Router) {

    //Conexión y subscripción
    this.socket = this.socket.connect();
    this.channel = this.socket.subscribe('Contactos');

    //Listener para nuevos Contactos
    this.channel.on('message', (data) => {
      this._ChatService.GetContactos(this.id).subscribe(data=>{
        this.Usuario=data     
      });
    });

  }

  id:string;
  nick:string;
  ngOnInit() {

    this.llaves = new Key();

    //Información Usuario
    this.id=localStorage.getItem('id');
    this.nick=localStorage.getItem('nick')

    this._ChatService.GetContactos(this.id).subscribe(data=>{
      this.Usuario=data
    });
  }

  ClickUsuario(usuario){
    //Ahí está el usuario para que lo usen en sus consultas
    console.log(usuario)

  }

  //Método de prueba para mandar al chat
  agregar(){
    this.Arreglo.push(new Mensaje('yo', this.mensaje));
    console.log(this.Arreglo);
    this.mensaje = '';
  }

  //metodos para enviar archivos atte el octa jujuju------------------------------------------


  llaves:Key;
  CerrarSesion(){
    var llaves = Object.keys(this.llaves);

    llaves.forEach(element => {
      localStorage.removeItem(element);
    });
    this._Router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.socket.close();
  }
}
