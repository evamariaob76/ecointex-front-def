import { ComerciosService } from '../../servicios/comercios.service';
import { Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {
  comercio: any = {};
  comercios: any = {};


  constructor(private activatedRoute: ActivatedRoute, 
              private comerciosService: ComerciosService,
              private router: Router,
             ) {
                this.activatedRoute.params.subscribe (params => {
                  this.comercio = comerciosService.getComercio(params['id']);
                  this.comercios = this.comerciosService.getComercios();
                });
              }
              
  ngOnInit() {
    window.scrollTo(0, 0);

    this.cargarComercio();
  }

  cargarComercio() : void{
    this.activatedRoute.params.subscribe(params =>{
    let id = params['id']  
    if (id){
      this.comerciosService.getComercio(id).subscribe((comercio => this.comercio = comercio))
    }
    })
  }

  
}



