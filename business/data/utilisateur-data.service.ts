import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Utilisateur} from '../../models/Utilisateur';
import {environment} from '../../../src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class UtilisateurDataService {

  constructor(private http: HttpClient) {
  }

  public getUtilisateurById(id: number): Promise<Utilisateur> {

    const url = `${environment.api_url_utilisateur}/${id}`;
    return this.http.get<Utilisateur>(url).toPromise();
  }

  public addUtilisateur(utilisateur: Utilisateur): Promise<Utilisateur> {

    if (utilisateur.prenom == null) {
      utilisateur.prenom = '';
    }

    if (utilisateur.nom == null) {
      utilisateur.nom = '';
    }

    const url = environment.api_url_utilisateur;
    return this.http.post<Utilisateur>(url, utilisateur, httpOptions).toPromise();
  }

  public updateUtilisateur(utilisateur: Utilisateur): Promise<Utilisateur> {

    const url = environment.api_url_utilisateur;
    return this.http.put<Utilisateur>(url, utilisateur, httpOptions).toPromise();
  }

  public deleteUtilisateur(utilisateur: Utilisateur): Promise<any> {

    const id = utilisateur.id;
    const url = `${environment.api_url_utilisateur}/${id}`;
    return this.http.delete(url, httpOptions).toPromise();
  }

}
