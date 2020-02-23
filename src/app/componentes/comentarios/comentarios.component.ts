import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ComentariosService, Comentario } from '../../servicios/comentarios.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { NgForm } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { CompartirInformacionService } from '../../servicios/compartir-informacion.service';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { UsuariosService, Usuario } from "../../servicios/usuarios.service";
import { URL_BACKEND } from "../../config/config";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-comentarios",
  templateUrl: "./comentarios.component.html",
  styleUrls: ["./comentarios.component.css"]
})
export class ComentariosComponent implements OnInit {
  comentario: Comentario = new Comentario();
  comentarios: any = {};
  fechaHoy: Date = new Date();
  comercio: Comercio = new Comercio();
  usuario: Usuario;
  comprobar: boolean = false;
  noExistenComentarios: boolean = true;
  idComentario: any;
  id: any = 0;
  contestacion: any;
  ver: boolean = false;
  coment: any;
  myClass: boolean = false;
  numeroComentarios: any;
  ocultar = false;
  private fragment: string;
  urlBackend: string = URL_BACKEND;
  url_backend: string = URL_BACKEND;
  url_firebase: string =
    "https://firebasestorage.googleapis.com/v0/b/pharmacyapp-b56e1.appspot.com/o/images%2F";
  url_firebase2 = "?alt=media&token=572032c4-c176-4e3d-8d2d-c4c5a378c7ca";

  constructor(
    private comentariosService: ComentariosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private comerciosService: ComerciosService,
    public authService: AutenticacionService,
    private compartirInformacionService: CompartirInformacionService,
    private usuariosService: UsuariosService
  ) {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
  }
  ngOnInit(): void {
    this.cargarUsuario();
    this.activatedRoute.fragment.subscribe(fragment => {
      this.fragment = fragment;
      if (fragment) {
        window.scrollTo(0, 240); // how far to scroll on each step
      }
    });

    this.activatedRoute.params.subscribe(params => {
      //me suscribo al serovicio de comentario
      let id = params["id"];
      this.comentario.id_comercio = id;
      this.comentario.fecha = this.fechaHoy;
      this.cargarComercio(); //llamo a la función
    });
    this.cargarNumerosComentario(); //lamada a la función
  }

  create(comentarioForm: NgForm): void {
    //creo un nuevo comentario llamando al servicio comentarios
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"];
      this.comentariosService.create(this.comentario).subscribe(json => {
        this.cargarComercio(); //actualizo los comentarios al crear uno nuevo
        this.cargarNumerosComentario(); //actualizo el numerod e comentarios al crear uno nuevo
        comentarioForm.reset({
          //reseto lo valores del formulario para la validación
          value: undefined
        });
      });
    });
  }

  cargarComercio(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"];
      if (id) {
        this.comerciosService
          .getComercio(id)
          .pipe(
            tap(response => {
              let comercios = response as Comercio;
              comercios.comentarios.forEach(comercio => {
                //array para recorrer todos los comercios
                this.noExistenComentarios = false;
              });
              if (comercios.comentarios.length <= 4) {
                this.myClass = true;
              } else {
                this.myClass = false;
              }
            })
          )
          .subscribe(comercio => {
            this.comercio = comercio;
            this.getFirebase(comercio.img);
          });
      }
    });
  }

  update(contestacionForm: NgForm, x): void {
    this.activatedRoute.params.subscribe(params => {
      //recojo de la url el número de comercio
      let id = params["id"];

      if (x) {
        //si existe id, de esta forma gestiono errores
        this.contestacion = <HTMLInputElement>(
          document.getElementById("contestacion")
        );

        this.comentario.id_comercio = id;
        this.comentario.id = x;
        this.comentario.contestacion = this.coment;
        this.comentariosService.update(this.comentario).subscribe(
          //me suscribo al servicio
          comentario => {
            this.ocultar = false;
            this.cargarComercio();
            contestacionForm.reset({
              //reseto lo valores del formulario para la validación
              value: undefined
            });
          }
        );
      }
    });
  }

  eliminarContestacion(x): void {
    this.activatedRoute.params.subscribe(params => {
      //recojo de la url el número de comercio
      let id = params["id"];
      if (x) {
        //si existe id, de esta forma gestiono errores
        swal
          .fire({
            title: "¿Está seguro de que quiere eliminar esta comentario?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si!"
          })
          .then(result => {
            if (result.value) {
              this.comentario.id_comercio = id;
              this.comentario.id = x;
              this.comentario.contestacion = null;
              this.comentariosService.update(this.comentario).subscribe(
                //me suscribo al servicio
                comentario => {
                  this.cargarComercio();
                }
              ),
                swal.fire("Se ha eliminado el comentario: ", "success");
            }
          });
      }
    });
  }

  eliminar(id): void {
    swal
      .fire({
        title: "¿Está seguro de que quiere eliminar esta comentario?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si!"
      })
      .then(result => {
        if (result.value) {
          this.comentariosService.delete(id).subscribe(json => {
            this.noExistenComentarios = true;
            this.cargarNumerosComentario(); //lamada a la función
            this.cargarComercio();
          });
        }
      });
  }

  mostrar() {
    switch (this.comprobar) {
      case true:
        this.comprobar = false;
        break;
      case false:
        this.comprobar = true;

        break;
    }
  }

  cambiar(contestacionForm, id) {
    document.getElementById("contestacion" + id).style.marginLeft = "50px";
    if ((document.getElementById("contestacion" + id).style.display = "none")) {
      document.getElementById("contestacion" + id).style.display = "inline";
    } else {
      document.getElementById("contestacion" + id).style.display = "none";
    }
    if ((document.getElementById("contestar" + id).style.display = "inline")) {
      document.getElementById("contestar" + id).style.display = "none";
    } else {
      document.getElementById("contestacion" + id).style.display = "none";
    }
  }

  outFocus(contestacionForm, id) {
    this.cancelar(contestacionForm, id);
  }
  cambiarAdmin(contestacionForm, id) {
    document.getElementById("contestacionAmin" + id).style.marginLeft = "50px";

    document.getElementById("contestacionAmin" + id).style.display = "inline";
    this.ocultar = true;
  }
  cambiarAdmin2(contestacionForm, id) {
    document.getElementById("contestacionAmin2" + id).style.marginLeft =
      "150px";

    document.getElementById("contestacionAmin2" + id).style.display = "inline";
    this.ocultar = true;
  }

  cancelar(contestacionForm, id) {
    document.getElementById("contestacion" + id).style.display = "none";
    this.ocultar = false;
    this.cargarComercio();
    contestacionForm.reset({
      //reseto lo valores del formulario para la validación
      value: undefined
    });
  }

  cargarNumerosComentario() {
    //función que llama al servicio CompartirInformacionService
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"];
      if (id) {
        this.compartirInformacionService
          .getNumeroComentario(id)
          .subscribe(comentariolength => {
            this.numeroComentarios = comentariolength;
            this.compartirInformacionService.setData(this.numeroComentarios);
          });
      }
    });
  }
  cargarUsuario() {
    //carga el usuario
    this.activatedRoute.params.subscribe(params => {
      this.usuariosService.getUsuario(2).subscribe(usuario => {
        this.usuario = usuario;
        this.getFirebase(usuario.img);
      });
    });
  }

  getFirebase(img) {
    var storage = firebase.storage();
    var gsReference = storage.refFromURL(
      "gs://pharmacyapp-b56e1.appspot.com/images/" + img
    );
    gsReference
      .getDownloadURL()
      .then(function(url) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function(event) {
          var blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();
      })
      .catch(function(error) {
        debugger;
      });
  }
}
