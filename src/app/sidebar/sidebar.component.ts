import { Component, OnInit } from '@angular/core';
import { ChatService } from '../Servicios/chat.service';
import Ws from '@adonisjs/websocket-client';
import * as conexion from '../Clases/url';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  socket = Ws(conexion.url_websocket);
  conversando: any = null;
  mensajes: any;
  //canal del ws
  wschannel: any;
  //canal por el cual habla, puede ser user o grupo
  channel: number;

  isTyping:Boolean=true;

  grupos: any;

  constructor(private chat_service: ChatService) {
    this.socket = this.socket.connect();
   }

  ngOnInit() {
    this.chat_service.getGrupos().subscribe(res => {
      this.grupos = res.grupos;
    });
  }

  irGrupo(grupo_id: number) {
    debugger;
    if (typeof this.wschannel !== "undefined") {
      this.wschannel.close();
    }

    // this.nombreGrupo = usergrupo.nombre;
    // this.room= usergrupo.id
    this.channel = grupo_id;
    this.subscribirACanal(this.channel);
    
    this.chat_service.getMensajes(this.channel).subscribe( res => {
      this.mensajes = res;
    });
  }



  subscribirACanal(grupo_id: number) {
    debugger;
    this.wschannel = this.socket.subscribe('grupo:' + grupo_id)

    this.wschannel.on('error', data => {

    });

    //cuando entra a un nuevo canal, se pone el escucha de nuevos mensajes
    this.wschannel.on('message', data => {

      // console.log('entr3')
      // this.http.get<any>('http://localhost:3333/chats/' + grupo_id).subscribe(res => {
      //   this.mensajes = res      
      //   this.file=res
      
      //   console.log(this.mensajes)
      //   // this.users = res.users
      // });   
     
    });

    this.wschannel.on('entrar', data => {
      console.log('acaba de entrar un usuario')
    });

    this.wschannel.on('close', data => {

    });

  }

}
