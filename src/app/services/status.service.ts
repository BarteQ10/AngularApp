import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Status } from '../interfaces/status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private baseUrl = 'http://127.0.0.1:8000'; // Bazowy adres API

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllStatuses(): Observable<Status[]>{
    const headers = this.createHeaders();
    return this.http.get<Status[]>(`${this.baseUrl}/get-all-statuses/`, { headers });
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
  }

  private getAuthToken(): string {
    return sessionStorage.getItem('jwt_token') || '';
  }
}
