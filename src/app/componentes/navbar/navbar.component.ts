import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ComerciosService } from '../../servicios/comercios.service';
import swal from 'sweetalert2';
import { AutenticacionService } from '../../servicios/autenticacion.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  comercio: any = {};
  comercios: any = {};
  constructor(private activatedRoute: ActivatedRoute,
    private comerciosService : ComerciosService,
    private router : Router,
    public authService: AutenticacionService) { }

  ngOnInit() {}

Inicio(){
  this.router.navigate(['/home']);

  }
  Autenticarse(){
    this.router.navigate(['/clientes/form']);
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
  
    //  this.router.navigate(['/comercios', actividad]);
    })
  }
}
