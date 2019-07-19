export class Mensaje {
  usuario: string;
  mensaje: string;
  tipo:String;
  constructor(usuario: string, mensaje: string) {
    this.usuario = usuario;
    this.mensaje = mensaje;
  }
  setTipo(tipo){
    this.tipo = tipo;
  }
}
