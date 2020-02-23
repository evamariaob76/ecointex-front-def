import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from '../../servicios/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { NgForm, FormArray } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of, pipe, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { EmailService } from '../../servicios/email.service';




@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']

})
export class FormComponent implements OnInit {
  clientes: Cliente[]=[]
  admin : boolean = false;
  form: FormGroup;
   cliente: Cliente = new Cliente();
   creadoCliente : boolean = false;
  usuarioExiste: boolean= false;
  private titulo: string =" Crear cliente";
  constructor(private clienteService: ClienteService, 
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public authService : AutenticacionService
            ){

          
               }
  ngOnInit() {
   
    window.scrollTo(0, 0); 
  
    this.cargarCliente();
}

  create(clienteForm: NgForm): void{
    this.clienteService.create(this.cliente).subscribe
    (json => {
      this.creadoCliente = true;
      this.cliente= new Cliente;
     clienteForm.reset({//reseto lo valores del formulario para la validación
        value: undefined
      })
    }) 
  }

  cargarCliente():void{
    this.activatedRoute.params.subscribe(params =>{
    let id = params['id']
    if (id){
      this.clienteService.getCliente(id).subscribe((cliente => this.cliente = cliente))
    }
    })
  }


  update(): void{
    this.clienteService.update(this.cliente).subscribe( json => {
       // this.router.navigate(['/clientes/page/0'])
        swal.fire('Cliente Actualizado',`${json.mensaje} : ${json.cliente.username}`, 'success')
      })
  }


}
