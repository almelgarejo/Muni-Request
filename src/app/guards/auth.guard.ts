import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const requiredRoles = route.data['role'];  // Ahora esperamos un array de roles permitidos
    console.log('Roles permitidos:', requiredRoles);

    return this.firebaseSvc.user$.pipe(
      take(1),
      map(user => {
        console.log('Usuario autenticado:', user);
        if (user && requiredRoles.includes(user.perfil)) {
          return true;
        } else {
          this.utilsSvc.RouterLink('/auth'); // Redirigir si no tiene el rol adecuado
          return false;
        }
      })
    );
  }
}
