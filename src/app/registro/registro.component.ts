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
    username: new FormControl('',
    [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('',
    [
      Validators.required,
      Validators.minLength(2),
      Validators.email
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
    var { email, username, password } = this.form.value;

    this.service.crearUser(email, username, password).subscribe(res => {
      alert(res.msg)

      this.router.navigate(['/login']);
    });
  }

}
