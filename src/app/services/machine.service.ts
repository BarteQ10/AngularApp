import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Machine } from '../interfaces/machine';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private baseUrl = 'http://127.0.0.1:8000'
  constructor(private http: HttpClient, private authService: AuthService) { }


  getAllMachines(): Observable<Machine[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('jwt_token') || ''}` // Dodaj token autoryzacyjny
    });
    return this.http.get<Machine[]>(`${this.baseUrl}/get-all-machines/`,{ headers });
  }
}
