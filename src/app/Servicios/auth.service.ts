import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as conexion from '../Clases/url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  crearUser(username: string, email: string, password: string) {

    var data = {
      username: username,
      email: email,
      password: password
    };

    return this.http.post(conexion.url_http + 'registro', data);
  }
}
