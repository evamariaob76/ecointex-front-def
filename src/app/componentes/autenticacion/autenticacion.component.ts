import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormArray } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ClienteService } from '../../servicios/cliente.service';
import { Cliente } from '../clientes/cliente';
import { ClientesComponent } from '../clientes/clientes.component';
import { Router } from '@angular/router';
import { map, catchError, tap } from 'rxjs/operators';



@Component({
  selector: 'app-autenticacion',
  templateUrl: './autenticacion.component.html',
  styleUrls: ['./autenticacion.component.css']
})
export class AutenticacionComponent implements OnInit {
  clientes: Cliente[]=[]
  form: FormGroup;

  constructor( private clienteService: ClienteService,
                private router : Router) {
     }

  ngOnInit() {
    let page: number = 0;

    this.clienteService.getClientes(page).pipe(
      tap(response =>{
        (response.content as Cliente[]). forEach(cliente =>{
        });

      })
    ).subscribe(response =>this.clientes = response.content as Cliente[]);
}


}
