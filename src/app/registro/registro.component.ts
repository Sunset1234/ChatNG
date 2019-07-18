import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Servicios/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

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

  constructor(private router: Router,private service: AuthService) { }

  ngOnInit() {
  }

  crear() {
    var { nickname, password } = this.form.value;

    this.service.crearUser(nickname, password).subscribe(res => {
      this.router.navigate(['/chat']);
    });
  }

}
