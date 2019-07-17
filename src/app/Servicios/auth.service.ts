import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as conexion from '../Clases/url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  crearUser(nickname: string,  password: string) {

    var data = {
      nickname:nickname,
      password: password
    };

    return this.http.post(conexion.url_http + 'Registro', data);
  }

  root: string = conexion.url_http;
  flag: boolean = false;

  login(nickname: string, password: string, url: string) {
    let jugador = {
      nickname: nickname,
      password: password
    }
    return this.http.post<any>(this.root + url, jugador);
  }

}
