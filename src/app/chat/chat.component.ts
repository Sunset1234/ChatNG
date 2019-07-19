import { Component, OnInit } from '@angular/core';
import { Mensaje } from '../Clases/mensaje';
import { ChatService } from '../Servicios/chat.service';
import { User } from '../Modelos/User';
import * as conexion from '../Clases/url';
import Ws from '@adonisjs/websocket-client';
import * as $ from 'jquery';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  mensaje: string = '';
  Usuario:User;

  grupos: any;
  grupo: number = null;
  mensajes: Array<Mensaje>;

  MensajeTitulo: string;

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
    this.channel.on('historial',(data) => {

    });
  }

  ngOnInit() {
    this._ChatService.GetContactos().subscribe(data=>{
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

  //método de prueba para mandar al chat
  agregar(){

    /*
    var msj = new Mensaje(
      localStorage.getItem('nombre'),
      this.mensaje
    );
       10 esto qué pedo? se supone que debe de ser dependiendo de los usuarios
    this._ChatService.sendMessageToGroup(this.grupo, msj);
    */
    var id = localStorage.getItem('chat');
    var obtenido = {mensaje: this.mensaje, tipo: 'texto',emisor: localStorage.getItem('jugador')};
    this._ChatService.mandarMensaje( id, obtenido ).subscribe( data => {
      console.log(data);
    }, err => {
      console.log(err)
    });
  }

  ngOnDestroy(): void {
    this.socket.close();
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

  //mandar datos al chat
  mandar(id , nickname){
    const remitente = {  id, nickname};
    const emisor = {id: localStorage.getItem('jugador') , nickname: localStorage.getItem('nick')};
    this._ChatService.obtener_chats(emisor, remitente).subscribe(data => {
      console.log(data);
      console.log(data['chat']._id);
      localStorage.setItem('chat', data['chat']._id);
     /* if (data['mensajes'] === null) {
        this.mensajes = new Array<Mensaje>();
      } else {
       /*data['mensajes'].forEach((valor)=>{
        this.mensajes.push(new Mensaje(data['chatUser'], valor.mensaje));
       });
       console.log(data['mensajes'][0].mensaje);
       this.mensajes = data['mensajes'][0].mensaje;

      }*/
      this.mensajes= new Array<Mensaje>();
      this.MensajeTitulo = 'Estás charlando con: ' + nickname;
       });

  }


  //metodos para enviar archivos atte el octa jujuju-----------------------------------------------------------
}
