import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { ClienteService } from '../../servicios/cliente.service';
import { ComerciosService, Comercio } from '../../servicios/comercios.service';
import { Cliente } from '../clientes/cliente';

@Component({
  selector: "app-paginator",
  templateUrl: "./paginator.component.html",
  styleUrls: ["./paginator.component.css"]
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() paginador: any;
  @Input() paginadorComercios: any;

  paginas: number[];
  desde: number;
  hasta: number;
  localizacion: boolean = false;
  comercios: Comercio[] = [];
  clientes: Cliente[] = [];

  constructor(

  ) {}

  ngOnInit() {
 
  }

  ngOnChanges() {
    this.desde = Math.min(
      Math.max(1, this.paginador.number - 4),
      this.paginador.totalPages - 5
    );
    this.hasta = Math.min(
      Math.max(this.paginador.totalPages, this.paginador.number - 4),
      6
    );
    if (this.paginador.totalPages > 5) {
      this.paginas = new Array(this.hasta - this.desde + 1)
        .fill(0)
        .map((valor, indice) => indice + this.desde);
    } else {
      this.paginas = new Array(this.paginador.totalPages)
        .fill(0)
        .map((valor, indice) => indice + 1);
    }

  }
}
