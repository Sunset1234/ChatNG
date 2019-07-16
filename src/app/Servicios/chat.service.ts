import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as conexion from '../Clases/url';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  constructor(private http: HttpClient) { }



  //obtiene grupos de un usuario
  getGrupos() {
    const user_id = localStorage.getItem('user_id');
    return this.http.get<any>(conexion.url_http + 'gruposs/' + user_id);
  }

  getMensajes(channel_id: number) {
    return this.http.get<any>(conexion.url_http + 'chat/' + channel_id);
  }

}
