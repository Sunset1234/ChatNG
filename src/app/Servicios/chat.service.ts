import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as conexion from '../Clases/url';
import { Mensaje } from '../Clases/mensaje';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  root: string = conexion.url_http;
  GetContactos(){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(this.root+'GetUsuarios',{headers:headers});
  }

  GetGrupos() {
    var user_id = localStorage.getItem('user_id');
    let headers = new HttpHeaders().set('Content-Type','application/json');

    return this.http.get<any>(this.root + 'gruposu/' + user_id, {headers:headers});
  }

  GetChatGrupo(grupo_id: number) {
    return this.http.get<any>(this.root + 'grupo/' + grupo_id);
  }

  sendMessageToGroup(grupo_id: number, mensaje: Mensaje) {
    var obj = {
      grupo_id: grupo_id,
      emisor_id: localStorage.getItem('user_id'),
      mensaje: mensaje.mensaje,
      tipo: 'txt'
    };

    return this.http.post<any>(this.root + 'grupopost', obj);
  }

  obtener_chats(emisor, remitente) {

    return this.http.post(this.root + 'chats', { emisor, remitente});
  }

}
