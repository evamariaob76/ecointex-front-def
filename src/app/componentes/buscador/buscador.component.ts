import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { URL_BACKEND } from "../../config/config";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";
import { environment } from "../../../environments/environment";


@Component({
  selector: "app-buscador",
  templateUrl: "./buscador.component.html",
  styleUrls: ["./buscador.component.css"]
})
export class BuscadorComponent implements OnInit {
  comercio: Comercio;
  comercios: Comercio[] = [];
  termino: string;
  url_backend: string = URL_BACKEND;
  url_firebase: string ="https://firebasestorage.googleapis.com/v0/b/pharmacyapp-b56e1.appspot.com/o/images%2F";
  url_firebase2 = "?alt=media&token=572032c4-c176-4e3d-8d2d-c4c5a378c7ca";
  constructor(
    private activatedRoute: ActivatedRoute,
    private comerciosService: ComerciosService
  )
{
  if (!firebase.apps.length) {
    firebase.initializeApp(environment.firebase);
  }
}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.termino = params["nombre"];
      let nombre = params["nombre"];
      this.comerciosService
        .findByName(nombre)
        .subscribe(comercios =>{(this.comercios = comercios)
           for (let comercio of this.comercios) {
        this.getFirebase(comercio.img)}
        } );
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
