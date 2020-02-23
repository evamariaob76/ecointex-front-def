import { Component, OnInit } from '@angular/core';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { Router, ActivatedRoute } from '@angular/router';
import { URL_BACKEND } from '../../config/config';
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";
import { environment } from "../../../environments/environment";
import { tap } from 'rxjs/operators';

@Component({
  selector: "app-editar-comercio",
  templateUrl: "./editar-comercio.component.html",
  styleUrls: ["./editar-comercio.component.css"]
})
export class EditarComercioComponent implements OnInit {
  htmlStr: string = "";
  htmlStr1: string = "";
  htmlStr2: string = "";
  estadoPositivo1: boolean = false;
  estadoPositivo2: boolean = false;
  estadoPositivo3: boolean = false;
  informacionBooleanLat: boolean = false;
  informacionBooleanLong: boolean = false;
  informacionBooleanActividad: boolean = false;
  comercio: any = {};
  fechaHoy: Date = new Date();
  archivo: File;
  archivo1: File;
  archivo2: File;
  visible: boolean = false;
  updateFoto = false;
  id: any = {};
  url_backend: string = URL_BACKEND;
  url_firebase: string =
    "https://firebasestorage.googleapis.com/v0/b/pharmacyapp-b56e1.appspot.com/o/images%2F";
  url_firebase2 = "?alt=media&token=572032c4-c176-4e3d-8d2d-c4c5a378c7ca";
  constructor(
    private comerciosService: ComerciosService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
  }
  ngOnInit() {
    //al cargarse la página se llama a la funcion cargarComercio que mostrará el comercio en el caso de que se vaya a editar
    this.cargarComercio();
  }

  cargarComercio() {
    //carga el comercio a editar
    this.activatedRoute.params.subscribe(params => {
      //subscribiéndome a los parámetros tenemos la id de comercio
      let id = params["id"];
      if (id) {
        this.comerciosService.getComercio(id).subscribe(comercio => {
          this.comercio = comercio;
          if (this.comercio.img != null) {
            this.getFirebase(this.comercio.img);
            this.getFirebase(this.comercio.img1);
            this.getFirebase(this.comercio.img2);
          }
        });
      }
    });
  }
  mostrarHTML() {
    this.visible = true;
  }

  seleccionarUnaFoto(event, id_foto) {
    //función que recoge la  información de img en el caso de actulizar una foto
    this.archivo = event.target.files[0];
    switch (id_foto) {
      case 1:
        this.upload1Foto(1);
        this.htmlStr = this.archivo.name;
        break;
      case 2:
        this.upload1Foto(2);
        this.htmlStr1 = this.archivo.name;
        break;
      case 3:
        this.upload1Foto(3);
        this.htmlStr2 = this.archivo.name;
        break;
    }
  }

  upload1Foto(id_img) {
    //Función que llama al Servicio y actualiza la foto
    this.activatedRoute.params.subscribe(params => {
      let id = params["id"];

      this.comerciosService
        .subir1Foto(this.archivo, id, id_img)
        .subscribe(json => {
          this.cargarComercio();
          this.updateFoto = true;
        });
    });
  }

  update(): void {
    this.comercio.actividad = this.comercio.actividad.toLowerCase();
    //función que llama al servicio correspondiente para actualizar el comercio
    this.comerciosService.update(this.comercio).subscribe(comercio => {
      this.comercio = comercio;
      this.visible = true;
      this.cargarComercio();
    });
  }

  cancelar() {
    //función que redirige al panel de administración si nos e quiere actualizar foto
    this.router.navigate(["/admin"]);
  }

  nuevoComercio() {
    //función que resetea los campos para incluir un nuevo comercio
    this.router.navigate(["/crear/comercios"]);
  }
  verEditado(id) {
    this.router.navigate(["/comercioCreado", id]);
  }

  informacionActividad() {
    switch (this.informacionBooleanActividad) {
      case false:
        document.getElementById("act").innerHTML =
          "El grupo de actividad se refiere a la actividad global del comercio, y en plural,  por ejemplo : restaurantes, hoteles, etc";
        this.informacionBooleanActividad = true;
        break;

      case true:
        document.getElementById("act").innerHTML = "";
        this.informacionBooleanActividad = false;
        break;
    }
  }

  informacionLat() {
    switch (this.informacionBooleanLat) {
      case false:
        document.getElementById("lat").innerHTML =
          "Hacer click en el siguiente enlace <a target='_blank'href='https://www.google.es/maps/?hl=es'>Maps.</a> Introducir la calle en el buscador incluyendo el número. Situarse sobre la chincheta, click en el botón derecho del ratón y seleccionar ¿Qué hay aquí?. En la subventana, el primer dato corresponde a latitud";
        this.informacionBooleanLat = true;
        break;

      case true:
        document.getElementById("lat").innerHTML = "";
        this.informacionBooleanLat = false;
        break;
    }
  }
  informacionLong() {
    switch (this.informacionBooleanLong) {
      case false:
        document.getElementById("lon").innerHTML =
          "Hacer click en el siguiente enlace <a  target='_blank' href='https://www.google.es/maps/?hl=es'>Maps.</a> Introducir la calle en el buscador incluyendo el número. Situarse sobre la chincheta, click en el botón derecho del ratón y seleccionar ¿Qué hay aquí?. En la subventana, el segundo dato corresponde a longitud";
        this.informacionBooleanLong = true;
        break;

      case true:
        document.getElementById("lon").innerHTML = "";
        this.informacionBooleanLong = false;
        break;
    }
  }
  getFirebase(img) {
    var storage = firebase.storage();
    var gsReference = storage.refFromURL(
      "gs://pharmacyapp-b56e1.appspot.com/images/" + img
    );
    gsReference
      .getDownloadURL()
      .then(function (url) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          var blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();
      })
      .catch(function (error) {
        debugger;
      });

  }
} 
