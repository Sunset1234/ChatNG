import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as conexion from '../Clases/url';

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

}
