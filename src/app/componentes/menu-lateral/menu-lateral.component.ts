import { Component, OnInit } from '@angular/core';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { Router } from '@angular/router';
import * as jQuery from 'jquery';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {
actividades : any=[];
  comercios: any = [];
  comercio: any = [];

  constructor(private activatedRoute: ActivatedRoute,
    private comerciosService: ComerciosService,
    private router: Router) {
  }

  ngOnInit() {
this.actividad();

  }

  verActividad(actividad: string) {
    this.comerciosService.findByName(actividad).subscribe(params => {
      this.router.navigate(['/comercio', actividad]);
    })
  }

  actividad() {
    this.comerciosService.actividad().subscribe(params => {
      this.actividades = params;
    })
  }
}