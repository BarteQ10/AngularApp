import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiConfig } from '../../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  private apiUrl = ApiConfig.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  addFavouriteMachine(machineId: number): Observable<any> {
    const userId = this.authService.getUserId(sessionStorage.getItem('jwt_token') || '')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('jwt_token') || ''}` // Dodaj token autoryzacyjny
    });
    const url = `${this.apiUrl}/add-favourite-machine/${userId}/${machineId}/`;
    return this.http.post(url,null, { headers });
  }

  removeFavouriteMachine(machineId: number): Observable<any> {
    const userId = this.authService.getUserId(sessionStorage.getItem('jwt_token') || '')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('jwt_token') || ''}` // Dodaj token autoryzacyjny
    });
    const url = `${this.apiUrl}/remove-favourite-machine/${userId}/${machineId}/`;
    return this.http.post(url,null, { headers });
  }
}
