import { Component, OnInit, Input } from "@angular/core";
import { ComerciosService, Comercio } from "../../servicios/comercios.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as $ from "jquery";
import {ComentariosService,Comentario} from "../../servicios/comentarios.service";
import { URL_BACKEND } from "../../config/config";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-body",
  templateUrl: "./body.component.html",
  styleUrls: ["./body.component.css"]
})
export class BodyComponent implements OnInit {
  comercios: Comercio[] = [];
  comercio: Comercio;
  comentarios: {};
  indice: number = 6;
  indiceMax: number = 0;
  mostrar: boolean = true;
  url_backend: string = URL_BACKEND;
  url_firebase: string =  "https://firebasestorage.googleapis.com/v0/b/pharmacyapp-b56e1.appspot.com/o/images%2F"
  url_firebase2="?alt=media&token=572032c4-c176-4e3d-8d2d-c4c5a378c7ca";

  constructor(
    private comerciosService: ComerciosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private comentariosService: ComentariosService
  ) {
  if (!firebase.apps.length) {
    firebase.initializeApp(environment.firebase);
  }  
  }

  ngOnInit() {
    this.cargarComercio();
    this.comerciosService.getComercios().subscribe(comercios => {
      this.comercios = comercios.reverse();
      this.indiceMax = this.comercios.length;
    });

  }   
  
  getFirebase(img){
 var storage = firebase.storage();
 var gsReference = storage.refFromURL(
   "gs://pharmacyapp-b56e1.appspot.com/images/"+img
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

  cargarComercio(): void {
    //llama a ComerciosService para cargar todos los comercios en pantalla
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"];
      if (id) {
        this.comerciosService
          .getComercio(id)
          .subscribe(comercio => {
            (this.comercio = comercio)
            this.getFirebase(comercio.img);
          });
      }
    });
  }

  addLike(id: number): void {
    this.comerciosService.addLike(id).subscribe(json => {
      for (let comercio of this.comercios) {
        if (comercio.id == id) {
          comercio.likes = json.likes;
          break;
        }
      }
    });
  }

  corazones() {
    //función que crea una animación para que cada vez que se haga click, el corazón cambie de color
    $("a").on("mouseover", function() {
      $(".fa-heart").on("click", function() {
        $(this).addClass("ver");
      });
    });
    $(".fa-heart")
      .delay(500)
      .removeClass("ver"); //quita la clase añadida retrasando su ejecución 500 milisegundos
  }

  sombreado() {
    //función mediante la cual los sombreados de las cajas de los comercios cambian al ponerse encima
    $(document).ready(function() {
      $(".sombras").hover(
        function() {
          $(this).css({
            "box-shadow": "10px 10px 50px #666",
            transition: "box-shadow 0.7s ease-in-out"
          });
        },
        function() {
          $(this).css("box-shadow", "none");
        }
      );
    });
  }

  masEntradas() {
    if (this.indice < this.indiceMax) {
      this.indice = this.indice + 2;
    }
  }

  menosEntradas() {
    if (this.indice > 5) {
      this.indice = this.indice - 2;
    } else {
      this.indice = this.indice;
    }
  }
}