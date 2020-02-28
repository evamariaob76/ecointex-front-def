import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, pipe, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { URL_BACKEND } from "../config/config";

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private httpHeaders = new HttpHeaders();
  private url: string = URL_BACKEND+'/api/sendmail';
  private urlPassword: string = URL_BACKEND+'/api/send/password';

  constructor(private router: Router,
    private http: HttpClient) { }


  sendEmail(id : string): Observable<any> {
    let formData = new FormData();
    formData.append("id", id);

    return this.http.post<any>(`${this.url}`, formData, { headers: this.httpHeaders } ).pipe(

      catchError(e => {
        console.error(id);
        swal.fire('error al enviar mail:', e.error.mensaje, 'error')
        return throwError(e);
      }),
    );
  }
  sendEmailAdmin(nombre : string,  email: string, telefono : string, empresa:string): Observable<any> {
    let formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("telefono", telefono);
    formData.append("empresa", empresa);

    return this.http.post<any>(`${this.url}/admin`, formData ,{ headers: this.httpHeaders }).pipe(
      catchError(e => {
        // console.error(e.error.mensaje);
        swal.fire('error al enviar mail:', e.error.mensaje, 'error')
        return throwError(e);
      }),
    );
  }

  sendPassword(nombre: string, apellido: string, username: string, email: string): Observable<any> {
    let formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("email", email);
    formData.append("username", username);

    return this.http.post<any>(`${this.urlPassword}`, formData, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        // console.error(e.error.mensaje);
        swal.fire('error al enviar mail:', e.error.mensaje, 'error')
        return throwError(e);
      }),
    );
  }
}



  export class Email {
  nombre: string;
  apellido: string;
  texto: string ;
  email: string ;
  username: string;
  telefono: string;
  empresa: string;
  politica:boolean;

};

