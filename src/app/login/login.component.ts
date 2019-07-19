import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/Servicios/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  //reactive forms
  form = new FormGroup({
    nickname: new FormControl('',
    [
      Validators.required,
      Validators.minLength(2),
    ]),
    password: new FormControl('',
    [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  //PROPIEDAD PARA MANDAR
  @Output() getEstadoUser=new EventEmitter();
  public estadoUser:boolean;

  constructor(private auth_service: AuthService, private router: Router) { }

  ngOnInit() {
    this.estadoUser=false;
  }

  msg:string="logeado";
  login() {      
    this.auth_service.login(this.form.value.nickname, this.form.value.password, 'Login').subscribe(data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('id',data.id)
      localStorage.setItem('nick', data.nick);
      this.router.navigate(['/chat']);
     
      },error=>{
        //this.alerta.setMessage('Usuario o contraseña invalidos','error');
      });
  }

  registro(){
    this.router.navigate(['/registro']);
  }

}
