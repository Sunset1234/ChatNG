import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as conexion from '../Clases/url';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  constructor(private http: HttpClient) { }

}
