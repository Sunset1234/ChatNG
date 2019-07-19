import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import * as conecta from '../Clases/url';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) {}

  //promesa porque ejecuta el resto del código sin la petición
  async canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): Promise<boolean> {
    var toLogin = route.url[0].path === 'login' ? true : false;
    var toCrear = route.url[0].path === 'registro' ? true : false;
    var toChat = route.url[0].path === 'chat' ? true : false;

    if (localStorage.getItem('token')) {
      //retorna un "objeto" aunque en consola diga true o false así que mejor lo parseo ¯\_(ツ)_/¯
      //si se modificó el token igual te manda pa tu casa
      var authenticated = Boolean(await this.verificarLogin().toPromise());

      //Si el path es login y estás autorizado no te deja entrar.
      if (toLogin) {
        if(authenticated){ return this.router.navigate(['/chat']) } else{ return true }
        //return authenticated ? false : true;
      }

      //Si el path es crear y estás autorizado no te deja entrar.
      if(toCrear){
        if(authenticated){ return this.router.navigate(['/chat']) } else{ return true }
      }

      return authenticated;
    }else {

      if(toCrear){ return true }
      if(toChat){ return this.router.navigate(['/registro']) }

      return toLogin ? true : false
    }
  }

  public verificarLogin() {
    //ponemos token en el header
    const headerAuth = new HttpHeaders({
      "autorizacion" : localStorage.getItem("token")
    });

    // return this.http.get('http://192.168.50.10:3333/' + 'verificar', {headers: headerAuth});
    return this.http.get(conecta.url_http + 'Verificar', {headers: headerAuth});
  }

}
