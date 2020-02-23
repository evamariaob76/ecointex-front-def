import { Component, OnInit, ChangeDetectionStrategy  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { ComentariosService, Comentario } from '../../servicios/comentarios.service';
import { Subscription } from 'rxjs/Subscription';
import { CompartirInformacionService } from '../../servicios/compartir-informacion.service';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import * as $ from 'jquery';
import { UsuariosService } from '../../servicios/usuarios.service';
import { URL_BACKEND } from "../../config/config";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";
import { environment } from "../../../environments/environment";


@Component({
  selector: "app-comercio",
  templateUrl: "./comercio.component.html",
  styleUrls: ["./comercio.component.css"]
})
export class ComercioComponent implements OnInit {
  comercio: any = {};
  comercios: Comercio[] = [];
  comentario: any = {};
  dataSuscription: Subscription;
  data: number;
  texto: string = "SI";
  usuario: any = {};
  estadoPositivo: boolean = true;
  comentariolength: any;
  private fragment: string;

  url_backend: string = URL_BACKEND;
  url_firebase: string ="https://firebasestorage.googleapis.com/v0/b/pharmacyapp-b56e1.appspot.com/o/images%2F";
  url_firebase2 = "?alt=media&token=572032c4-c176-4e3d-8d2d-c4c5a378c7ca";
  constructor(
    private activatedRoute: ActivatedRoute,
    private comerciosService: ComerciosService,
    private comentariosService: ComentariosService,
    private router: Router,
    private usuariosService: UsuariosService,
    private compartirInformacionService: CompartirInformacionService,
    public authService: AutenticacionService
  )
{
  if (!firebase.apps.length) {
    firebase.initializeApp(environment.firebase);
  }
}
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"];
    });
    this.activatedRoute.fragment.subscribe(fragment => {
      this.fragment = fragment;
      if (!fragment) {
        window.scrollTo(0, 0); 
      }
    });

    this.cargarComercio(); //llamo a la función cargar comercio al cargar la página
    this.cargarUsuario();

    this.dataSuscription = this.compartirInformacionService.dataSource.subscribe(
      json => {
        this.comentariolength = json;
      }
    );
  }

  Inicio() {
    //función que redirige a la página de inicio
    this.router.navigate(["/home"]);
  }

  cargarUsuario() {
    //carga el usuario a editar
    this.activatedRoute.params.subscribe(params => {
      //subscribiéndome a los parámetros tenemos la id de comercio
      this.usuariosService.getUsuario(2).subscribe(usuario => {
        this.usuario = usuario;
        this.getFirebase(usuario.img)
      });
    });
  }
  comoLlegar() {
    //función que redirige a la página link de cada uno de los comercios accediendo al id de la ruta
    let URL = window.location.pathname;
    let posicion = URL.charAt(URL.length - 1);
    this.router.navigate(["/link", posicion]);
  }

  cargarComercio(): void {
    //función que llama al servicio para cargar el comercio mediante id, accediento a través de parámetros de dirección url
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"];
      if (id) {
        this.comerciosService.getComercio(id).subscribe(comercio => {
          this.comercio = comercio;
          this.getFirebase(comercio.img);
          this.getFirebase(comercio.img1);
          this.getFirebase(comercio.img2);
        });
        this.addVisitas(id); //cada vez que se cargue el comercio se llama a la función addVisitas para añadir al contador
      }
    });
  }

  addVisitas(id: number): void {
    //llama al servicio y añado las visitas a cada uno de los comercios
    if (
      !this.authService.isAuthenticated() == true &&
      !this.authService.hasRole("ROLE_ADMIN")
    ) {
      this.comerciosService
        .addVisitas(id)
        .subscribe(comercio => (this.comercio = comercio));
    }
  }

  addLike(id: number): void {
    //llama al servicio y añado el like al comercio
    this.comerciosService.addLike(id).subscribe(json => {
      this.comercio.likes = json.likes; //se muestra en pantalla en tiempo real
    });
  }

  cargarComentario(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"];
      if (id) {
        this.comentariosService
          .getComentarioComercio(id)
          .subscribe(comentario => (this.comentario = comentario));
      }
    });
  }

  findByName(nombre: string): void {
    this.comerciosService.findByName(nombre).subscribe(params => {
      this.router.navigate(["/buscar", nombre]);
    });
  }

  corazones() {
    //función que crea una animación para que cada vez que se haga click, el corazón cambie de color
    $(".corazon").click(function() {
      $(this).addClass("corazonClick");
    });
    $(".corazon").mousemove(function() {
      $(this).removeClass("corazonClick");
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