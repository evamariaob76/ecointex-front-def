import { Injectable } from "@angular/core";
import { onErrorResumeNext } from 'rxjs';
import { Observable, of, pipe, throwError} from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpParams} from '@angular/common/http';
import Swal from 'sweetalert2';
import { map, catchError, tap } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { AutenticacionService } from './autenticacion.service';
import swal from 'sweetalert2';
import { URL_BACKEND } from "../config/config";


@Injectable()
export class ComerciosService {
  private comercios : Comercio[]=[];
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private url : string = URL_BACKEND+'/api/comercios';
 private urlDelete: string = URL_BACKEND+'/api/comercio';

    constructor(private router: Router,
                private http : HttpClient,
                private authService: AutenticacionService

                ) {   }
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

    getComercios() : Observable <Comercio[]>{
      return this.http.get<Comercio[]>(this.url);
    }

    findByName(actividad : string): Observable <Comercio[]>{
      return this.http.get<Comercio[]>(`${this.url}/${actividad}/busqueda`, { headers: this.httpHeaders } );
    }

  getComercio(id: number): Observable<Comercio> {
    return this.http.get<Comercio>(`${this.url}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        this.router.navigate(['/home']);
        return throwError(e);
      })
    );
  }

  getComercioFecha(mes: number): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.url}/${mes}/mes`).pipe(
      catchError(e => {
        this.router.navigate(['/home']);
        return throwError(e);
      })
    );
  }

  findOneComercioByDate(): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.url}/date/comercio`).pipe(
      catchError(e => {
        this.router.navigate(['/home']);
        return throwError(e);

      })
    );
  }

  actividad(): Observable<Comercio[]> {
    return this.http.get<Comercio[]>(`${this.url}/allActividad`).pipe(
      catchError(e => {
        this.router.navigate(['/home']);
        return throwError(e);

      })
    );
  }
    getComerciosAll(page: number): Observable<any> {
      return this.http.get(this.url + '/page/' + page, { headers: this.agregarAuthorizationHeader() }).pipe(
        catchError(e => {
          this.isNoAutorizado(e);
          return throwError(e);
        }),
        tap((response: any) => {
          (response.content as Comercio[]).forEach(comercio => console.log(comercio.nombre));
        }),
        map((response: any) => {
          (response.content as Comercio[]).map(comercio => {
            comercio.nombre = comercio.nombre.toUpperCase();

            return comercio;
          });
          return response;
        }),
        tap(response => {
          (response.content as Comercio[]).forEach(comercio => console.log(comercio.nombre));
        })
      );
    }

  create(comercio: Comercio): Observable<any> {
    return this.http.post<any>(`${this.url}/crear`, comercio, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if (e.staus == 400) {
          return throwError(e);
        }
      })
    );
  }

    update(comercio: Comercio): Observable<any>{
      return this.http.put<any>(`${this.url}/${comercio.id}`, comercio, { headers: this.agregarAuthorizationHeader()}).pipe(
        catchError(e =>{
          if (e.staus == 400) {
            return throwError(e);
          }
          })
        );
    }

  delete(id: number): Observable<Comercio> {
    return this.http.delete<Comercio>(`${this.urlDelete}/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if (e.staus == 400) {
          return throwError(e);
          this.router.navigate(['/home']);

        }
      })
    );
  }
  getMaxLikes(): Observable<any> {
    return this.http.get<any>(`${this.url}/maxLikes`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if (e.staus == 400) {
          return throwError(e);
        }
      })
    );
  }
  findLastLikes(): Observable<any> {
    return this.http.get<any>(`${this.url}/lastLikes`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if (e.staus == 400) {
          return throwError(e);
        }
      })
    );
  }
  getMaxVisitas(): Observable<any> {
    return this.http.get<any>(`${this.url}/maxVisitas`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if (e.staus == 400) {
          return throwError(e);
        }
      })
    );
  }
   addLike(id: number): Observable<Comercio> {
     return this.http.post<any>(`${this.url}/${id}/likes`, { headers: this.httpHeaders } );
        }
   addVisitas(id: number): Observable<Comercio> {
      return this.http.post<any>(`${this.url}/${id}/visitas`, { headers: this.httpHeaders } );
     }

  subirFoto(archivo: File, archivo1: File, archivo2: File, id): Observable<HttpEvent<{}>>{
     let formData = new FormData();
     formData.append("archivo", archivo);
     formData.append("archivo1", archivo1);
     formData.append("archivo2", archivo2);
     formData.append("id", id);
    let params = new HttpParams();

    
     let httpHeaders= new HttpHeaders();
     let token = this.authService.token;
     if(token != null){
          httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
        }
     const req = new HttpRequest('POST', `${this.url}/upload`, formData, {
          reportProgress: true,
          headers: httpHeaders,
       params: params,
        });
     return this.http.request(req).pipe(
          catchError(e => {
            this.isNoAutorizado(e);
            return throwError(e);
          })
        );
    
      }
    
  subir1Foto(archivo: File, id, id_img): Observable<HttpEvent<{}>>  {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    let httpHeaders= new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    const req = new HttpRequest('POST', `${this.url}/uploadOneFoto/${id_img}`, formData, {
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
}
export class Comercio{
        id:number=null;
        nombre: string="";
        parrafoOne: string="";
        parrafoTwo: string = "";
        img: string="";
        img1: string="";
        img2: string="";
        aparicion:string="";
        lat: string="";
        lng: string="";
        direccion: string="";
        cp: string="";
        telefono:string="";
        facebook:string="";
        actividad:string="";
        likes:number=0;
        createAt:Date;
        resumen:string="";
        comentarios:[];
        visitas: number = 0;
    }




