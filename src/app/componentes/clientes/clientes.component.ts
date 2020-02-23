import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from '../../servicios/cliente.service';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AutenticacionService } from '../../servicios/autenticacion.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[]=[]
  paginador: any;

  constructor( private clientesService: ClienteService,
               private activatedRoute: ActivatedRoute,
               public authService: AutenticacionService

    ) { }

  ngOnInit() {
   /* this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }
      this.clientesService.getClientes(page)
        .pipe(
          tap(response => {
            console.log('ClientesComponent: tap 3');
            (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
          })
        ).subscribe(response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });*/
    this.getClientes();

  }


  getClientes() {

    this.activatedRoute.paramMap.subscribe(params => {//función que llama al servicio para poder hacer un listado mediante páginas
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clientesService.getClientes(page)
        .pipe(
          tap(response => {

            (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
          })
        ).subscribe(response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });
  }
  
  delete(cliente: Cliente):void{
let nombre=cliente.nombre.toUpperCase();
let apellido=cliente.apellido.toUpperCase();

  swal.fire({
    title: '¿Está seguro de que quiere eliminar esta entrada?',
    text: `${nombre+ '  '+apellido }`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si!'
  }).then((result) => {
    if (result.value) {
      this.clientesService.delete(cliente.id).subscribe(
        responde=>{
          this.getClientes();

          this.clientes = this.clientes.filter (cli => cli !==cliente)

                swal.fire(
        'Cliente eliminado!',
        'ha sido eliminado correctamente.',
        'success')
        }
      

      )
    }
  })

}
}
