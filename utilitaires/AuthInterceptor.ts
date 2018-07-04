
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {AuthDataService} from '../business/data/auth-data.service';
import {throwError} from 'rxjs/internal/observable/throwError';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthDataService) {}

  /**
   * Personalise le header de toutes les requétes
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler):  Observable<HttpEvent<any>> {
    let authToken = '';
    if (this.auth.token.token !== undefined) {
        authToken = this.auth.token.token;
    }
    // Clone the request and set the new header in one step.
    const authReq = req.clone({ setHeaders: { Authorization: authToken } });
    return next.handle(authReq)
      .catch((error, caught) => {
        console.log('une erreur est survenue');
        console.log(error);
        this.auth.logout();
        return throwError(error);
      }) as any;
  }
}
