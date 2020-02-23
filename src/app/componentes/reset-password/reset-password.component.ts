import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  usuario: any = {};
  password : string;
  constructor(private usuariosService: UsuariosService,
              private router : Router) { }

  ngOnInit() {
  }
  resetPassword(passwordForm: NgForm): void {//método para resetear la contraseña
    let password = passwordForm.value.password;
    this.usuariosService.updateUsuarioPassword(password)
      .subscribe(json => {
        swal.fire('Has actualizado correctamente la contraseña', 'success')
      });
    this.router.navigate(['/admin']);
  }
}
