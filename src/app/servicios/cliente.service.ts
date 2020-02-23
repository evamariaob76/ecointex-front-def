import { Injectable } from '@angular/core';
import { Observable, of, pipe, throwError} from 'rxjs';
import { CLIENTES } from '../../app/componentes/clientes/clientes.json';
import { Cliente } from '../componentes/clientes/cliente';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router'; 
import { formatDate } from '@angular/common';
import { AutenticacionService } from './autenticacion.service';
import { URL_BACKEND } from '../config/config'



@Injectable({
  providedIn: "root"
})
export class ClienteService {
  private urlEndPoint: string = URL_BACKEND + "/api/clientes";
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AutenticacionService
  ) {}

  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append("Authorization", "Bearer " + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean {
    if (e.status == 401 || e.status == 403) {
      //no autorizado/servidor ha denegado el servicio
      if (this.authService.isAuthenticated()) {
        this.authService.logout(); //cerramos sesión si expira
      }
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
  getClientesSinPage(): Observable<any[]> {
    return this.http.get<Cliente[]>(this.urlEndPoint);
  }

  getClientes(page: number): Observable<any> {
    return this.http
      .get(this.urlEndPoint + "/page/" + page, {
        headers: this.agregarAuthorizationHeader()
      })
      .pipe(
        catchError(e => {
          this.isNoAutorizado(e);
          return throwError(e);
        }),
        tap((response: any) => {
          console.log("ComerciosService: tap 1");
          (response.content as Cliente[]).forEach(cliente =>
            console.log(cliente.nombre)
          );
        }),
        map((response: any) => {
          (response.content as Cliente[]).map(comercio => {
            comercio.nombre = comercio.nombre.toUpperCase();

            return comercio;
          });
          return response;
        }),
        tap(response => {
          console.log("ClienteService: tap 2");
          (response.content as Cliente[]).forEach(comercio =>
            console.log(comercio.nombre)
          );
        })
      );
  }
  create(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if (e.staus == 400) {
          return throwError(e);
        }
        if (e.status == 500) {
          swal.fire('el username o email ya existe en la base de datos :', cliente.username, 'error');
          return throwError(e);
        }
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http
      .get<Cliente>(`${this.urlEndPoint}/${id}`, {
        headers: this.agregarAuthorizationHeader()
      })
      .pipe(
        catchError(e => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          swal.fire("error al editar:", e.error.mensaje, "error");
          return throwError(e);
        })
      );
  }
  update(cliente: Cliente): Observable<any> {
    return this.http
      .put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {
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

  delete(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/${id}`, {
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
}