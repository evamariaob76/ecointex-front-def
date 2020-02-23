import { Component, OnInit } from '@angular/core';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { EmailService } from '../../servicios/email.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { URL_BACKEND } from "../../config/config";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";

@Component({
  selector: "app-crear-comercio",
  templateUrl: "./crear-comercio.component.html",
  styleUrls: ["./crear-comercio.component.css"]
})
export class CrearComercioComponent implements OnInit {
  htmlStr: string = "*es obligatorio subir la imagen 1";
  htmlStr1: string = "*es obligatorio subir la imagen 2";
  htmlStr2: string = "*es obligatorio subir la imagen 3";
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
  visibleFoto: boolean = false;
  id: number;
  actividades: any = [];
  otros: string = "";
  url_backend: string = URL_BACKEND;
  url_firebase: string = "https://firebasestorage.googleapis.com/v0/b/pharmacyapp-b56e1.appspot.com/o/images%2F";
  url_firebase2 = "?alt=media&token=572032c4-c176-4e3d-8d2d-c4c5a378c7ca";

  constructor(
    private comerciosService: ComerciosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.actividad(); //al cargarse la página se llama a la funcion cargarComercio que mostrará el comercio en el caso de que se vaya a editar
  }

  cargarComercio(id) {
    //carga el comercio a editar
    this.comerciosService
      .getComercio(id)
      .subscribe(comercio => {
        (this.comercio = comercio)
        if (this.comercio.img) {
          this.getFirebase(this.comercio.img)
          this.getFirebase(this.comercio.img1);
          this.getFirebase(this.comercio.img2);
        }
      });
  }
  actividad() {
    this.comerciosService.actividad().subscribe(params => {
      this.actividades = params;
    });
  }
  mostrarHTML() {
    this.visible = true;
  }

  createAll(): void {
    //creamos un nuevo comercio
    this.comercio.createAt = this.fechaHoy;
    this.comercio.likes = 0;
    this.comercio.visitas = 0;
    this.comercio.actividad = this.comercio.actividad.toLowerCase();
    this.comerciosService.create(this.comercio).subscribe(json => {
      swal.fire("Comercio creado:", `${json.comercio.nombre}`, "success");
      this.id = json.comercio.id;

      this.enviarmail(this.id);//función que hace que cuando se crea un comercio nuevo mande un mail de información
      this.uploadFotos(this.id);
      this.visibleFoto = true;
      if (this.comercio.img != null) {
        this.getFirebase(this.comercio.img);
        this.getFirebase(this.comercio.img1);
        this.getFirebase(this.comercio.img2);
      }

    });
  }
  seleccionarFoto(event) {
    //función que recoge la  información de img
    this.archivo = event.target.files[0];
    this.htmlStr = this.archivo.name;
    this.estadoPositivo1 = true; //variable que hace cambiar el color al subir una imagen en la img1
  }
  seleccionarFoto1(event) {
    //función que recoge la  información de img1
    this.archivo1 = event.target.files[0];
    this.htmlStr1 = this.archivo.name;
    this.estadoPositivo2 = true; //variable que hace cambiar el color al subir una imagen en la img2
  }
  seleccionarFoto2(event) {
    //función que recoge la  información de img2
    this.archivo2 = event.target.files[0];
    this.htmlStr2 = this.archivo.name;
    this.estadoPositivo3 = true; //variable que hace cambiar el color al subir una imagen en la img3
  }

  uploadFotos(id) {
    //función para subir todas las fotos de un comercio creado
    if (
      this.seleccionarFoto1 &&
      this.seleccionarFoto2 &&
      this.seleccionarFoto
    ) {
      this.comerciosService
        .subirFoto(this.archivo, this.archivo1, this.archivo2, id)
        .subscribe(response => {
          if (response.type == 4) {
            this.visibleFoto = true;
            this.cargarComercio(id);
            //i++;
          }
        });
    }
  }
  /*actualizarFoto(): void {//función que llama al servicio  insertar todas las fotos al comercio creado
    this.comerciosService.update(this.comercio).subscribe
      (json => {

        this.cargarComercio();
      })
    this.visible = true;
  }*/

  nuevoComercio() {
    //función que resetea los campos para incluir un nuevo comercio
    this.visible = false;
    this.comercio = new Comercio();
  }
  enviarmail(id) {
    this.emailService.sendEmail(id).subscribe();
    console.log('mailok');
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
  verCreado(id) {
    this.router.navigate(["/comercioCreado", id]);
  }
  getFirebase(img) {
    var storage = firebase.storage();
    var pathReference = storage.ref("images/a.jpg");
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
