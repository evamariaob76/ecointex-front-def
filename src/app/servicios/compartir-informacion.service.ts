import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';
import { ComentariosService, Comentario } from '../servicios/comentarios.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_BACKEND } from "../config/config";

//servicio que llamará al back end para obtener el número de comentarios, ya que estos comentarios se actualizan desde otro componente

@Injectable({
  providedIn: 'root'
})
export class CompartirInformacionService {
  private httpHeaders = new HttpHeaders();
  private urlComentarios: string = URL_BACKEND+'/api/comentarios';
  private urlComercios: string = URL_BACKEND+'/api/comercios';


numeroComentarios: number = 0;
  comentario: Comentario = new Comentario();

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private comentariosService: ComentariosService) { }

//el operado de la librería ReactiveX nos permite compartir información entre los componentes
//Primero asignados a una variable un new BehaviorSubject<>() para posteriormente asignar esta variable como un Observable.
  
    public dataSource = new BehaviorSubject<number>(this.numeroComentarios);
    datasources$=this.dataSource.asObservable();
     
     public setData(numeroComentarioNew){
        this.numeroComentarios = numeroComentarioNew;
         this.dataSource.next(numeroComentarioNew);
    }

    getNumeroComentario(id: number): Observable<number> {//llamamos al back end para que nos proporciones el numero de comentarios por id
      return this.http.get<number>(`${this.urlComentarios}/numero/${id}`);
    }

  getMeses(): Observable<number> {//llamamos al back end para que nos proporciones el numero de meses distintos existentes
    return this.http.get<number>(`${this.urlComercios}/meses`);
  }
}
