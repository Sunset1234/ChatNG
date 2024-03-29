import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(private _Router:Router) { }

  ngOnInit() {
  }

  IniciarSesion(){
    this._Router.navigate(['/login']);
  }

  Registrarse(){
    this._Router.navigate(['/registro']);
  }

}
