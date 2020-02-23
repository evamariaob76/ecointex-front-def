import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { ClienteService } from "../../servicios/cliente.service";
import { ComerciosService, Comercio } from "../../servicios/comercios.service";
import { Cliente } from "../clientes/cliente";

@Component({
  selector: "app-paginator-comercios",
  templateUrl: "./paginatorComercios.component.html",
})
export class PaginatorComerciosComponent implements OnInit, OnChanges {
  @Input() paginadorComercios: any;

  paginas: number[];
  desde: number;
  hasta: number;
  localizacion: boolean = false;
  comercios: Comercio[] = [];
  clientes: Cliente[] = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.desde = Math.min(
      Math.max(1, this.paginadorComercios.number - 4),
      this.paginadorComercios.totalPages - 5
    );
    this.hasta = Math.min(
      Math.max(
        this.paginadorComercios.totalPages,
        this.paginadorComercios.number - 4
      ),
      6
    );
    if (this.paginadorComercios.totalPages > 5) {
      this.paginas = new Array(this.hasta - this.desde + 1)
        .fill(0)
        .map((valor, indice) => indice + this.desde);
    } else {
      this.paginas = new Array(this.paginadorComercios.totalPages)
        .fill(0)
        .map((valor, indice) => indice + 1);
    }
  }
}
