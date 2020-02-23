import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, of, pipe, throwError } from 'rxjs';
import { AutenticacionService } from './autenticacion.service';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { URL_BACKEND } from "../config/config";



@Injectable({
  providedIn: "root"
})
export class UsuariosService {
  private url: string = URL_BACKEND+"/api/usuarios";
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
  private httpHeadersUsuario = new HttpHeaders();
  usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AutenticacionService
  ) {}

  private isNoAutorizado(e): boolean {
    if (e.status == 401 || e.status == 403) {
      //no autorizado/servidor ha denegado els ervicio
      swal.fire(
        "Acceso denegado",
        "Hola: " +
          this.authService.usuario.username +
          "no tienes acceso a este recurso",
        "warning"
      );
      this.router.navigate(["/home"]);
      return true;
    }
    return false;
  }
  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append("Authorization", "Bearer " + token);
    }
    return this.httpHeaders;
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.url}/${id}`, { headers: this.httpHeadersUsuario })
      .pipe(
        catchError(e => {
          console.error(e.error.mensaje);
          swal.fire("error al buscar:", e.error.mensaje, "error");
          return throwError(e);
        })
      );
  }

  updateUsuario(usuario: Usuario): Observable<any> {
    return this.http
      .put<any>(`${this.url}/${usuario.id}`, usuario, {
        headers: this.agregarAuthorizationHeader()
      })
      .pipe(
        catchError(e => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, "error");
          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;

    if (token != null) {
      httpHeaders = httpHeaders.append("Authorization", "Bearer " + token);
    }
    const req = new HttpRequest("POST", `${this.url}/foto`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });
    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  subirFotoPortada(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;

    if (token != null) {
      httpHeaders = httpHeaders.append("Authorization", "Bearer " + token);
    }
    const req = new HttpRequest(
      "POST",
      `${this.url}/editarfotoPortada`,
      formData,
      {
        reportProgress: true,
        headers: httpHeaders
      }
    );
    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  updateUsuarioPassword(password: String): Observable<any> {
    return this.http
      .put<any>(`${this.url}/password`, password, {
        headers: this.httpHeadersUsuario
      })
      .pipe(
        catchError(e => {
          console.error(e.error.mensaje);
          swal.fire("error al editar:", e.error.mensaje, "error");
          return throwError(e);
        })
      );
  }
}


export class Usuario {
         id: number;
         nombre: string;
         username: string;
         apellido: string;
         createAt: string;
         email: string;
         bio: string;
         descripcion: string;
         fotoPortada: string;
         password: string;
         roles: string[] = [];
         img: string = "";
       }
