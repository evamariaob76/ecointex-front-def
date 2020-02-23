import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuarios-login/usuario';
import swal from 'sweetalert2';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { Router } from '@angular/router';
import { EmailService, Email } from '../../servicios/email.service';


@Component({
  selector: 'app-usuarios-login',
  templateUrl: './usuarios-login.component.html',
  styleUrls: ['./usuarios-login.component.css']
})
export class UsuariosLoginComponent implements OnInit {
  titulo: string= "Identificarse ";
  usuario : Usuario;
  apellido: string;
  email: string;
  texto: string;
  nombre: string;
  Email: Email = new Email;
  recuperar : boolean = false;
  constructor( public authService: AutenticacionService,
               private router: Router,
               private emailService : EmailService)
  {
    this.usuario = new Usuario();
   }

  ngOnInit() {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/admin']);
    }

  }

  login(): void {
    if (this.usuario.username == null || this.usuario.password == null) {
      swal.fire('Error Login', 'Username o password vacías!', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;     
      swal.fire('Login', 'Hola : '+ usuario.username +', has iniciado sesión con éxito!', 'success');

    }, err => {
      if (err.status == 400) {
        this.recuperar=true;
        swal.fire('Error Login', 'Usuario o clave incorrectas!', 'error');
      }
    }
    );
  }

   cerrarSesion() :void{
    this.authService.logout();
    }

    VerLikes(){
      this.router.navigate(['/likes']);
    }
}
