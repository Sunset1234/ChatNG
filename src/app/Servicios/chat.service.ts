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
  GetContactos(id){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(this.root+'GetUsuarios/'+id,{headers:headers});
  }

  GetGrupos() {
    var user_id = localStorage.getItem('user_id');
    let headers = new HttpHeaders().set('Content-Type','application/json');

    return this.http.get<any>(this.root + 'gruposu/' + user_id, {headers:headers});
  }

  GetChatGrupo(grupo_id: number) {
    return this.http.get<any>(this.root + 'grupo/' + grupo_id);
  }

  sendMessageToGroup(grupo_id: number, mensaje: Mensaje,tipo: string) {
    var obj = {
      grupo_id: grupo_id,
      emisor_id: parseInt(localStorage.getItem('user_id')),
      mensaje: mensaje.mensaje,
      tipo: tipo
    };

    console.log("MANDNDO EL PUTO OBJETO POR QUE NO LLEGA AAAAAAA")
    console.table(obj)

    return this.http.post<any>(this.root + 'grupopost', obj);
  }

}
