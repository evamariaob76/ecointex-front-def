import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuarios-login/usuario';
import swal from 'sweetalert2';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { EmailService, Email } from '../../servicios/email.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {
  titulo: string = "Identificarse ";
  usuario: Usuario;
  apellido: string;
  email: string;
  texto: string;
  nombre: string;
  Email: Email = new Email;
  recuperar: boolean = false;

  constructor(private authService: AutenticacionService,
    private router: Router,
    private emailService: EmailService) {
    this.usuario = new Usuario();
  }

  ngOnInit() {

  }

  enviarPassword(mensajeForm: NgForm) {
    this.Email.nombre=this.Email.nombre.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    this.Email.apellido = this.Email.apellido.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    this.Email.username = this.Email.username.toLowerCase();


    this.emailService.sendPassword(this.Email.nombre, this.Email.apellido, this.Email.username, this.Email.email ).subscribe(
      json => {

      });
    mensajeForm.reset({//reseto lo valores del formulario para la validación
      value: undefined
    });
    this.Email = new Email();
    this.recuperar = true;

  }

}
