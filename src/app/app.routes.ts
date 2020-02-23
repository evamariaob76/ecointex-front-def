
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LinkComponent } from './componentes/link/link.component';
import { AutenticacionComponent } from './componentes/autenticacion/autenticacion.component';
import { FormComponent } from './componentes/clientes/form.component';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { ComerciosLikesComponent } from './componentes/comercios-likes/comercios-likes.component';
import { AuthGuard } from './guards/auth.guard';
import { BodyComercioComponent } from './componentes/body-comercio/body-comercio.component';
import { GetComentariosComponent } from './componentes/get-comentarios/get-comentarios.component';
import { CrearComercioComponent } from './componentes/crear-comercio/crear-comercio.component';
import { BioComponent } from './componentes/bio/bio.component';
import { ContactoComponent } from './componentes/contacto/contacto.component';
import { EditarComercioComponent } from './componentes/editar-comercio/editar-comercio.component';
import { RolesGuard } from './guards/roles.guard';
import { BodyAdminComponent } from './componentes/body-admin/body-admin.component';
import { BodyActividadesComponent } from './componentes/body-actividades/body-actividades.component';
import { BodyFechasComponent } from './componentes/body-fechas/body-fechas.component';
import { BodyBuscadorComponent } from './componentes/body-buscador/body-buscador.component';
import { RecuperarPasswordComponent } from './componentes/recuperar-password/recuperar-password.component';
import { ResetPasswordComponent } from './componentes/reset-password/reset-password.component';
import { BodyComercioCreadoComponent } from './componentes/body-comercio-creado/body-comercio-creado.component';
import { BodyUpdatedAdminComponent } from './componentes/body-updated-admin/body-updated-admin.component';


const RUTAS: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'comercios/:id', component: BodyComercioComponent },
    { path: 'comercioCreado/:id', component: BodyComercioCreadoComponent },
    { path: 'buscar/:nombre', component: BodyBuscadorComponent },
    { path: 'link/:id', component: LinkComponent },
    { path: 'comercio/:nombre', component: BodyActividadesComponent },
    { path: 'autenticacion', component: AutenticacionComponent },
    { path: 'clientes/form', component: FormComponent },
    { path: 'clientes/form/:id', component: FormComponent, canActivate: [AuthGuard, RolesGuard], data: {role: 'ROLE_ADMIN'} },
    { path: 'clientes/page/:page', component: ClientesComponent, canActivate: [AuthGuard, RolesGuard], data: { role: 'ROLE_ADMIN' }  },
    { path: 'comercios/page/:page', component: ComerciosLikesComponent, canActivate: [AuthGuard, RolesGuard], data: { role: 'ROLE_ADMIN' }  },
    { path: 'likes', component: ComerciosLikesComponent, canActivate: [AuthGuard, RolesGuard], data: { role: 'ROLE_ADMIN' }   },
    { path: 'comentarios/:id', component: GetComentariosComponent },
    { path: 'crear/comercios', component: CrearComercioComponent, canActivate: [AuthGuard, RolesGuard], data: { role: 'ROLE_ADMIN' }  },
    { path: 'admin', component: BodyAdminComponent },
    { path: 'mes/:mes', component: BodyFechasComponent },
    { path: 'bio', component: BioComponent },
    { path: 'home/resetPasword', component: ResetPasswordComponent },
    { path: 'password', component: RecuperarPasswordComponent },
    { path: 'contacto/form', component: ContactoComponent },
    { path: 'editar/:id', component: EditarComercioComponent, canActivate: [AuthGuard, RolesGuard], data: { role: 'ROLE_ADMIN' } },
    { path: 'uploadAmin', component: BodyUpdatedAdminComponent, canActivate: [AuthGuard, RolesGuard], data: { role: 'ROLE_ADMIN' }  },


    { path: '**', pathMatch: 'full', redirectTo: 'home' }

]; 


export const APP_ROUTING = RouterModule.forRoot(RUTAS);