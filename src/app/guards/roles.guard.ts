import { Injectable, ɵConsole } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {
  constructor(private authService: AutenticacionService,
              private route: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      this.route.navigate(['/home']);
      return false;
    }
    let role = next.data.role as string; // hacemos un cast a string
    if (this.authService.hasRole(role)) {
        return true;
    }
    swal.fire('Acceso denegado', 'Hola: ' + this.authService.usuario.username + 'no tienes acceso a este recurso', 'warning');
    this.route.navigate(['/home']);
    return false;
  }
}
