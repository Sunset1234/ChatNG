import { Component, OnInit } from '@angular/core';
import { Mensaje } from '../Clases/mensaje';
import { ChatService } from '../Servicios/chat.service';
import { User } from '../Modelos/User';
import * as conexion from '../Clases/url';
import Ws from '@adonisjs/websocket-client';
import { Router } from '@angular/router';
import { Key } from '../Modelos/key';
import * as $ from 'jquery';
import { Observable, fromEvent, observable } from 'rxjs';
import { throttleTime, map, debounceTime, merge } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { strictEqual } from 'assert';
import { text } from '@angular/core/src/render3';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  Arreglo: Array<Mensaje>;
  mensaje: string = '';
  Usuario:User;
  mensajito: Observable<any>;
  grupos: any;
  grupo: number = null;
  mensajes: Array<Mensaje>;
  typing: String = "";
  tipogrupo:any;

  MensajeTitulo: string;


  //VALIDACIÓN PARA MOSTRAR CONTACTOS O CONVERSACIONES
  ValidaContactos:boolean


  //Conexión WebSocket
  socket= Ws(conexion.url_websocket);
  channel: any;
  channel2:any;
  constructor(private http:HttpClient,private _ChatService:ChatService,private _Router:Router) {

    //Conexión y subscripción de Contactos
    this.socket = this.socket.connect();
    this.channel = this.socket.subscribe('Contactos');
    this.channel2=this.socket.subscribe('MisGrupos');

    //Listener para nuevos Contactos
    this.channel.on('message', (data) => {
      this._ChatService.GetContactos(this.id).subscribe(data=>{
        this.Usuario=data
      });
    });

     //Listener para nuevos Grupos
     this.channel2.on('message', (data) => {
      this._ChatService.GetGrupos().subscribe(res => {
        this.grupos = res.grupos;
      });
    });

  }

  //Variables de Local Storage
  id:string;
  nick:string;
  ngOnInit() {

    this.llaves = new Key();

    //Por default no muestro contactos
    this.ValidaContactos=false;

    //Información Usuario
    this.id=localStorage.getItem('user_id');
    this.nick=localStorage.getItem('nick')

    //Obtener Contactos
    this._ChatService.GetContactos(this.id).subscribe(data=>{
      this.Usuario=data
    });

    //Obtener Grupos
    this._ChatService.GetGrupos().subscribe(res => {
      /*res['grupos'].forEach(element => {
        this.tipogrupo=element;
        console.log(this.tipogrupo['tipo'])
      });*/
      this.grupos = res.grupos;
    });

    $(document).ready(() => {
      $("a").click(function(event) {
        event.preventDefault();
      });
    });
  }


  //Nombre Grupo
  NombreGrupo:string;
  CrearGrupo(){

    if(this.NombreGrupo==""){
      alert('Escribe un nombre para el grupo');
    }
    else{
//Leyendo los id's seleccionados
let valoresCheck = [];

$("input[type=checkbox]:checked").each(function(){
    valoresCheck.push(this.value);
});

valoresCheck.push(localStorage.getItem('user_id'));
let idgrupo:any;

//Canal de grupos
this.channel2 = this.socket.getSubscription('MisGrupos');

this._ChatService.CrearGrupo(this.NombreGrupo,valoresCheck).subscribe(data=>{
  idgrupo=data['grupo'].id

  for (let index = 0; index < valoresCheck.length; index++) {
    console.log(valoresCheck[index])
    this._ChatService.AsignaGente(valoresCheck[index],idgrupo).subscribe(data=>{
      this.channel2.emit('message', data);
    });
  }

});
this.NombreGrupo="";

    }

  }

  ClickUsuario(usuario){
    this.mandar(usuario.id,usuario.nickname);
    this.MensajeTitulo = 'Estás charlando con: ' + usuario.nickname;
    this.ValidaContactos=false;

    //Canal de grupos
    this.channel2 = this.socket.getSubscription('MisGrupos');
    let data={mensaje:"hola"}
    this.channel2.emit('message',data);
  }

  MostrarContactos(){
    this.ValidaContactos=true;
  }
  mostrarNombre(nombre){
    console.log(nombre);
    let valor= nombre.split(" ")
    if ( valor[0] !== this.nick) {
      return valor[0]
    }else{
      return valor[1]
    }
  }

//mandar datos al chat
mandar(id , nickname){
  const remitente = {  id, nickname};
  const emisor = {id: localStorage.getItem('user_id') , nickname: localStorage.getItem('nick')};
  this._ChatService.obtener_chats(emisor, remitente).subscribe(data => {
    console.log(data['grupo'].id);
    this.irGrupo(data['grupo'].id,data['grupo']);
  });
}

  //Método de prueba para mandar al chat
  tipo:string;
  agregar(){
    // this.Arreglo.push(new Mensaje('yo', this.mensaje));
    // console.log(this.Arreglo);
    // this.mensaje = '';
    if (this.mensaje==""){
      alert('¡Escribe un mensaje!');
    }
    else{
      var msj = new Mensaje(
        localStorage.getItem('nombre'),
        this.mensaje
      );
        this.tipo='txt';
      this._ChatService.sendMessageToGroup(this.grupo, msj,this.tipo).subscribe(res => {
        this.mensaje = '';
      });
    }

  }

  irGrupo(id_grupo: number, grupo) {

    this.channel = this.socket.getSubscription('grupo:' + this.grupo);

    if (typeof this.channel !== 'undefined' && this.channel) {
      this.channel.close();
    }
    if (grupo['tipo'] === 'personal') {
      this.MensajeTitulo = '';
      const nombre = grupo['nombre_grupo'].split(' ');
      if ( nombre[0] !== this.nick) {
        this.MensajeTitulo = 'Hablas con: ' + nombre[0];
      } else {
        this.MensajeTitulo = 'Hablas con: ' + nombre[1];
      }
    } else {
      this.MensajeTitulo = '';
      this.MensajeTitulo = 'Grupo de: ' + grupo['nombre_grupo'];
    }
    this.grupo = id_grupo;
    //traer historial del grupo
    this._ChatService.GetChatGrupo(id_grupo).subscribe(res => {
      this.Arreglo = res.chats.map((data) => {
        return new Mensaje(
          data.mensaje[0].emisor_nombre,
          data.mensaje[0].mensaje
        );
      });
      console.log('-- arreglo')
      console.log(this.Arreglo)
      this.subscribirGrupo(id_grupo);
    });
  }

  subscribirGrupo(grupo_id: number) {

    this.channel = this.socket.getSubscription('grupo:' + grupo_id);

    if (!this.channel) {
      this.channel = this.socket.subscribe('grupo:' + grupo_id);
    }

    this.channel.on('error', data => {

    });

    this.channel.on('mensaje', data => {
      this.Arreglo.push(
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

    this.channel.on('escribiendo', data => {
      this.genteEscribiendo(data);
    });

    this.channel.on('notescribiendo', data => {

      this.genteEscribiendo(data);
    });

    setTimeout(() => {
      this.escribiendo();
    }, 1000)
  }

  escribiendo() {
    //se obtiene el input con un selector y se crea con fromEvent un observable
    var input = document.querySelector("#msjbox");
    var obs = fromEvent(input, 'input');

    /*
      pipe al observable para usar el throttleTime y no saturar el socket con mensajes
      se hace un merge para agregar y que no se confunda de operador (debouncetime) el cual servirá para
      detectar cuando alguien deje de escribir.
      Se le hace un map donde se le asigna un nombre al operador y poder identificarlo luego para mandar un emit distinto
    */

    const subscriber = obs.pipe(
      throttleTime(2000),
      map(() => 'throttle'),
      merge(
        obs.pipe(
          debounceTime(2000),
          map(() => 'debounce'),
        )
      )
    ).subscribe((x) => { //se obtiene la subscripcion y se manda por el canal que alguien escribe

      var data = {
        grupo: this.grupo,
        usuario: localStorage.getItem('nick')
      };

      if (x === 'throttle') {
        //si hay alguien escribiendo
        this.socket.getSubscription('grupo:' + this.grupo).emit('escribiendo', data);
      } else {
        //cuando alguien deje de escribir
        this.socket.getSubscription('grupo:' + this.grupo).emit('notescribiendo', data);
      }
    });
  }

  genteEscribiendo(data) {
    if (typeof data !== 'undefined') {
      if (data.length > 0 && data.length < 2) {
        this.typing = data[0] + ' está escribiendo...';
      } else if (data.length === 2) {
        data = data.filter((usuario) => {
          return usuario !== localStorage.getItem('nick');
        });

        let usuarios = data.join(', ');
        this.typing = usuarios + ' están escribiendo...';
      } else if (data.length > 2) {
        data = data.filter((usuario) => {
          return usuario !== localStorage.getItem('nick');
        });

        this.typing = 'Varias personas están escribiendo...';
      } else {
        this.typing = '';
      }
    }
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

  //Enviar Archivos------------------------------------------------------------------------------------------------------------------
  //para enviar audios-------
  guardaraudio(event){

    let elemnt = event.target
    let formData = new FormData()

     if(elemnt.files.length > 0)
     {
       formData.append('file',elemnt.files[0])
       this.http.post<any>('http://localhost:3333/archivos',formData).subscribe(res =>{
       console.log(res);
       var msj = new Mensaje(
        localStorage.getItem('nombre'),
        res.url
      );
        this.tipo='audio';

      this._ChatService.sendMessageToGroup(this.grupo, msj,this.tipo).subscribe(res => {
        this.mensaje = '';
        console.log(this.tipo);
      });
       })
     }
  }
//para enviar imagen---------------
  guardarimagen(event){

    let elemnt = event.target
    let formData = new FormData()

     if(elemnt.files.length > 0)
     {
       formData.append('file',elemnt.files[0])
       this.http.post<any>('http://localhost:3333/archivos',formData).subscribe(res =>{
       console.log(res);
       var msj = new Mensaje(
        localStorage.getItem('nombre'),
        res.url
      );
        this.tipo='imagen';

      this._ChatService.sendMessageToGroup(this.grupo, msj,this.tipo).subscribe(res => {
        this.mensaje = '';
        console.log(this.tipo);
      });
       })
     }
    }
//para enviar videos------------------
    guardarvideo(event){
    let elemnt = event.target
    let formData = new FormData()
      if(elemnt.files.length > 0)
     {
        formData.append('file',elemnt.files[0])
        this.http.post<any>('http://localhost:3333/archivos',formData).subscribe(res =>{
        console.log(res);
        var msj = new Mensaje(
          localStorage.getItem('nombre'),
          res.url
        );
          this.tipo='video';
        this._ChatService.sendMessageToGroup(this.grupo, msj,this.tipo).subscribe(res => {
          this.mensaje = '';
          console.log(this.tipo);
        });
        })
      }
      }


}
