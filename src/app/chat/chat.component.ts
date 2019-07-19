import { Component, OnInit } from '@angular/core';
import { Mensaje } from '../Clases/mensaje';
import { ChatService } from '../Servicios/chat.service';
import { User } from '../Modelos/User';
import * as conexion from '../Clases/url';
import Ws from '@adonisjs/websocket-client';
import { Router } from '@angular/router';
import { Key } from '../Modelos/key';
import * as $ from 'jquery';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  Arreglo = new Array<Mensaje>();
  mensaje: string = '';
  Usuario:User;

  grupos: any;
  grupo: number = null;
  mensajes: Array<Mensaje>;

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


  //Variables de Local Storage
  id:string;
  nick:string;
  ngOnInit() {

    this.llaves = new Key();

    //Información Usuario
    this.id=localStorage.getItem('id');
    this.nick=localStorage.getItem('nick')

    //Obtener Contactos
    this._ChatService.GetContactos(this.id).subscribe(data=>{
      this.Usuario=data
    });

    this._ChatService.GetGrupos().subscribe(res => {
      this.grupos = res.grupos;
    });

    $(document).ready(() => {
      $("a").click(function(event) {
        event.preventDefault();
      });
    });
  }

  ClickUsuario(usuario){
    //Ahí está el usuario para que lo usen en sus consultas
    console.log(usuario)

  }

  //Método de prueba para mandar al chat
  agregar(){
    // this.Arreglo.push(new Mensaje('yo', this.mensaje));
    // console.log(this.Arreglo);
    // this.mensaje = '';

    var msj = new Mensaje(
      localStorage.getItem('nombre'),
      this.mensaje
    );

    this._ChatService.sendMessageToGroup(this.grupo, msj).subscribe(res => {
      console.log(res)
    });
  }

  irGrupo(id_grupo: number) {
    this.grupo = id_grupo;
    //traer historial del grupo
    this._ChatService.GetChatGrupo(id_grupo).subscribe(res => {
      this.mensajes = res.chats.map((data) => {
        return new Mensaje(
          data.mensaje[0].emisor_nombre,
          data.mensaje[0].mensaje
        );
      });
      this.subscribirGrupo(id_grupo);
    });
  }

  subscribirGrupo(grupo_id: number) {
    this.channel = this.socket.subscribe('grupo:' + grupo_id)

    this.channel.on('error', data => {

    });

    this.channel.on('mensaje', data => {
      this.mensajes.push(
        new Mensaje(
          data.emisor_nombre,
          data.mensaje
        )
      );
    });
    
    this.channel.on('entrar', data => {
      console.log('acaba de entrar un usuario')
    });

    this.channel.on('close', data => {

    });

  }


  /*--------------------------------------*/
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
