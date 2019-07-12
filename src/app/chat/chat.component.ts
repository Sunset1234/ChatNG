import { Component, OnInit } from '@angular/core';
import { Mensaje } from '../Clases/mensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  Arreglo = new Array<Mensaje>();
  mensaje: string = '';
  constructor() {

  }

  ngOnInit() {
  }

  //método de prueba para mandar al chat
  agregar(){
    this.Arreglo.push(new Mensaje('yo', this.mensaje));
    console.log(this.Arreglo);
    this.mensaje = '';
  }

  //metodos para enviar archivos atte el octa jujuju-----------------------------------------------------------
}
