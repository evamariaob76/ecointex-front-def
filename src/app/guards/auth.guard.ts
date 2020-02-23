import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../servicios/autenticacion.service';
import swal from 'sweetalert2';

//eventos que sirven para controlar el acceso a las rutas y componente antes de acceder a las rutas
//así damos seguridad extra
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService : AutenticacionService,
              private route: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.isAuthenticated()){
        if(this.isTokenExpirado()){
          this.authService.logout();
          swal.fire('La sesión ha expirado, debes volver a autenticarte',  'warning');

          this.route.navigate(['/admin']);
          return false;
        }
        return true;
      }
      this.route.navigate(['/home']);
      return false;
  }

  isTokenExpirado() : boolean{
    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime()/1000;
    if(payload.exp<now){
     swal.fire('La sesión ha expirado, debes volver a autenticarte', 'warning');
     this.route.navigate(['/admin']);
     return true;
    }
    return false;
  }
}
