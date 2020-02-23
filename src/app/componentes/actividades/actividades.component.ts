import { Component, OnInit } from '@angular/core';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { URL_BACKEND } from "../../config/config";
import { tap } from "rxjs/operators";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";
import { environment } from "../../../environments/environment";



@Component({
  selector: "app-actividades",
  templateUrl: "./actividades.component.html",
  styleUrls: ["./actividades.component.css"]
})
export class ActividadesComponent implements OnInit {
  comercios: Comercio[] = [];
  nombre: string;
  comercio: any = [];
  url_backend: string = URL_BACKEND;
  url_firebase: string =
    "https://firebasestorage.googleapis.com/v0/b/pharmacyapp-b56e1.appspot.com/o/images%2F";
  url_firebase2 = "?alt=media&token=572032c4-c176-4e3d-8d2d-c4c5a378c7ca";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private comerciosService: ComerciosService,
    private menuLateralComponent: MenuLateralComponent
  ) {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let nombre = params["nombre"];
      this.comerciosService.findByName(nombre).subscribe(comercios => {
        this.comercios = comercios;
        for (let comercio of this.comercios) {
          this.getFirebase(comercio.img);
        }
      });
    });
  }
  verComercio(i: number) {
    this.router.navigate(["/comercio", i]);
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
      .catch(function(error) {});
  }
}

