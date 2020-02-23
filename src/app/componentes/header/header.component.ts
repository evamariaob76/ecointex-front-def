import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ComerciosService } from '../../servicios/comercios.service';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { UsuariosService } from '../../servicios/usuarios.service';
import { DomSanitizer } from '@angular/platform-browser';
import { URL_BACKEND } from "../../config/config";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/storage";


 
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  comercio: any = {};
  comercios: any = {};
  usuario: any = {};
  foto: any;
  url_backend: string = URL_BACKEND;
  url_firebase: string = "https://firebasestorage.googleapis.com/v0/b/pharmacyapp-b56e1.appspot.com/o/images%2F";
  url_firebase2 = "?alt=media&token=572032c4-c176-4e3d-8d2d-c4c5a378c7ca";

  constructor(private activatedRoute: ActivatedRoute,
              private comerciosService : ComerciosService,
              private router : Router,
              private _sanitizer: DomSanitizer,
              private usuariosService: UsuariosService,
              public authService: AutenticacionService
              ) { }

  ngOnInit() {

    $(document).ready(function() {
      $(".menu-icon").on("click", function() {
            $("nav ul").toggleClass("showing");
      });
});
    
    // Scrolling Effect
    $(window).on("scroll", function() {
          if($(window).scrollTop()) {
                $('nav').addClass('black');
          }
          else {
                $('nav').removeClass('black');
          }
    })
    this.cargarUsuario();
   }

  Inicio(){
    this.router.navigate(['/home']);
  }
  
  cargarComercio():void{
    this.activatedRoute.params.subscribe(params =>{
    let id = params['id']
    if (id){
          this.comerciosService.getComercio(id).subscribe((comercio => this.comercio = comercio))
        }
      })
    }

    findByName(nombre : string ): void {
      this.comerciosService.findByName(nombre).subscribe( params => {
        this.router.navigate(['/buscar', nombre]);
    })
    }

    verActividad(nombre:string){
      this.comerciosService.findByName(nombre).subscribe( params => {
        this.router.navigate(['/comercios', nombre]);
      })
  }

  cargarUsuario(){
    this.usuariosService.getUsuario(2).subscribe((usuario => {
      if(usuario.fotoPortada){
this.getFirebase(usuario.fotoPortada);

//this.foto = this.url_backend+"/api/descargasAdmin/img/"+usuario.fotoPortada;
this.foto = this.url_firebase+usuario.fotoPortada+this.url_firebase2;
        }
    }));
  }
  getFirebase(img:string) {
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


