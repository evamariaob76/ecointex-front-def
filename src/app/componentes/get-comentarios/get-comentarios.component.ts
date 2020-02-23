import { Component, OnInit } from '@angular/core';
import { Comentario, ComentariosService } from '../../servicios/comentarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-get-comentarios',
  templateUrl: './get-comentarios.component.html',
  styleUrls: ['./get-comentarios.component.css']
})
export class GetComentariosComponent implements OnInit {
  comentarios: any ={};
  comentario: Comentario;
  comercio: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private comentariosService : ComentariosService,
    private comerciosService: ComerciosService,
    public authService: AutenticacionService) {
          this.activatedRoute.params.subscribe (params => {
      this.comercio = comerciosService.getComercio(params['id']);
    });
  }
  ngOnInit() {
    this.cargarComentario();
    this.cargarComercio();
  }


  cargarComentario():void{
    this.activatedRoute.params.subscribe(params =>{
    let id = params['id']
      if (id){
        this.comentariosService.getComentarioComercio(id).pipe(
          tap(response => {
        this.comentario = response;
          })
        ).subscribe((comentarios => {this.comentarios = comentarios}));
      }
    })
  }

  cargarComercio():void{
    this.activatedRoute.params.subscribe(params =>{
    let id = params['id']
      if (id){
        this.comerciosService.getComercio(id).subscribe((comercio => this.comercio = comercio));
      }
    })
  }
}
