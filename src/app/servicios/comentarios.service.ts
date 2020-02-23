import { Injectable } from '@angular/core';
import { Observable, of, pipe, throwError} from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { AutenticacionService } from './autenticacion.service';
import { URL_BACKEND } from '../config/config'

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private httpHeaders = new HttpHeaders();
  private url: string = URL_BACKEND+'/api/comentarios';

constructor(private router: Router,
            private http : HttpClient,
            private authService: AutenticacionService
            ) {}

  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }


  private isNoAutorizado(e): boolean {
    if (e.status == 401 || e.status == 403) {//no autorizado/servidor ha denegado els ervicio
      swal.fire('Acceso denegado', 'Hola: ' + this.authService.usuario.username + "no tienes acceso a este recurso", 'warning');
      this.router.navigate(['/home']);
      return true;
    }
    return false
  }

  getComentarios() : Observable <Comentario[]>{
    return this.http.get<Comentario[]>(this.url);
  }

  getComentario (id: number) : Observable<Comentario>{
    return this.http.get<Comentario>(`${this.url}/${id}`).pipe(
      catchError(e => {
      swal.fire('error al editar:', e.error.mensaje, 'error')
        return throwError(e);
      })
    );
  }
  

  getComentarioComercio (id: number) : Observable<Comentario>{
    return this.http.get<Comentario>(`${this.url}/comercio/${id}`).pipe(
      catchError(e => {
      swal.fire('error al editar:', e.error.mensaje, 'error')
        return throwError(e);
      })
    );
  }

  update(comentario: Comentario): Observable<any>{
    return this.http.put<any>(`${this.url}/contestacion/${comentario.id_comercio}/${comentario.id}`, comentario, { headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e =>{
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        this.router.navigate(['/autenticacion'])
        swal.fire(  e.error.mensaje, e.error.error, 'error' );
      return throwError(e);
        })
      );
  }
  

  create(comentario: Comentario): Observable<any>{
    return this.http.post<any>(`${this.url}/${comentario.id_comercio}`, comentario, { headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e =>{
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        swal.fire(  e.error.mensaje, e.error.error, 'error' );
        return throwError(e);
        }
        )
      );
  }
    delete(id: number): Observable<Comentario[]> {
      return this.http.delete<Comentario[]>(`${this.url}/${id}`, { headers: this.agregarAuthorizationHeader()}).pipe(
        catchError(e => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      )

    }
}

export class Comentario{
    id:number;
    comentario: string;
    id_comercio: number;
    nombre : string;
    email: string;
    fecha: Date;
    contestacion: string;
 
};




