import { Component, OnInit } from '@angular/core';
import { Mensaje } from '../Clases/mensaje';
import { ChatService } from '../Servicios/chat.service';
import { User } from '../Modelos/User';
import * as conexion from '../Clases/url';
import Ws from '@adonisjs/websocket-client';

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
  constructor(private _ChatService:ChatService) {

    //Conexión y subscripción
    this.socket = this.socket.connect();
    this.channel = this.socket.subscribe('Contactos');

    //Listener para nuevos Contactos
    this.channel.on('message', (data) => {
      this._ChatService.GetContactos().subscribe(data=>{
        this.Usuario=data     
      });
    });

  }

  ngOnInit() {
    this._ChatService.GetContactos().subscribe(data=>{
      this.Usuario=data
    });
  }

  //método de prueba para mandar al chat
  agregar(){
    this.Arreglo.push(new Mensaje('yo', this.mensaje));
    console.log(this.Arreglo);
    this.mensaje = '';
  }

  ngOnDestroy(): void {
    this.socket.close();
  }

  //metodos para enviar archivos atte el octa jujuju-----------------------------------------------------------
}
