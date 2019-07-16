import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Servicios/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form = new FormGroup({
    username: new FormControl('',
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

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }


  login() {
    var { username, password } = this.form.value;

    this.auth.login(username, password).subscribe(data => {
      debugger;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user);
      // this.router.navigate(['/lobby']);
      },error=>{
        alert(error);
      });
  }

  registro(){
    this.router.navigate(['/crear']);
  }

}
