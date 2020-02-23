import { Component, OnInit } from '@angular/core';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompartirInformacionService } from '../../servicios/compartir-informacion.service';
import { tap } from 'rxjs/operators';
import { URL_BACKEND } from "../../config/config";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-menu-dinamico",
  templateUrl: "./menu-dinamico.component.html",
  styleUrls: ["./menu-dinamico.component.css"]
})
export class MenuDinamicoComponent implements OnInit {
  comercios: any[] = [];
  comercio: [] = [];
  mes: any;
  termino: any;
  comerciosMeses: any[] = [];
  me: any[] = [];
  m: any[] = [];
  cero: number;
  sortedActivities: any[] = [];
  url_backend: string = URL_BACKEND;
  url_firebase: string ="https://firebasestorage.googleapis.com/v0/b/pharmacyapp-b56e1.appspot.com/o/images%2F";
  url_firebase2 = "?alt=media&token=572032c4-c176-4e3d-8d2d-c4c5a378c7ca";
  constructor(
    private activatedRoute: ActivatedRoute,
    private comerciosService: ComerciosService,
    private compartirInformacionService: CompartirInformacionService,
    private router: Router
  )
{
  if (!firebase.apps.length) {
    firebase.initializeApp(environment.firebase);
  }
}

  ngOnInit() {
    this.comerciosService.findOneComercioByDate().subscribe(me => {
      this.me = me.reverse();
      for (let comercio of this.me) {
        this.getFirebase(comercio.img);
      }
    });
    this.compartirInformacionService.getMeses().subscribe(mes => {
      this.mes = mes;
      this.mes.reverse();
    });
  }
  verFecha(mes: number) {
    this.comerciosService.getComercioFecha(mes).subscribe(params => {
      this.router.navigate(["/mes", mes]);
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