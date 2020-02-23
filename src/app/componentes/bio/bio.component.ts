import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import { ActivatedRoute } from '@angular/router';
import { URL_BACKEND } from "../../config/config";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-bio",
  templateUrl: "./bio.component.html",
  styleUrls: ["./bio.component.css"]
})
export class BioComponent implements OnInit {
  usuario: any = {};
  url_backend: string = URL_BACKEND;
  url_firebase: string =
    "https://firebasestorage.googleapis.com/v0/b/pharmacyapp-b56e1.appspot.com/o/images%2F";
  url_firebase2 = "?alt=media&token=572032c4-c176-4e3d-8d2d-c4c5a378c7ca";
  constructor(
    private usuariosService: UsuariosService,
    private activatedRoute: ActivatedRoute
  ) 
  {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }

  }

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    //carga el usuario
    this.activatedRoute.params.subscribe(params => {
      this.usuariosService
        .getUsuario(2)
        .subscribe(usuario => {
          (this.usuario = usuario)
          this.getFirebase(usuario.img)
        });
    });
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