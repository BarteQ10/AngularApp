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
    const userId = this.authService.getUserId(sessionStorage.getItem('jwt_token') || '')
    const headers = this.createHeaders();
    return this.http.get<Machine[]>(`${this.baseUrl}/get-all-machines/${userId}/`,{ headers });
  }
  getMachinesBySize(size : String): Observable<any[]>{
    const userId = this.authService.getUserId(sessionStorage.getItem('jwt_token') || '')
    const headers = this.createHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/get-available-machines-by-size/${size}/${userId}/`,{ headers });
  }
  updateMachine(machine: Machine): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${this.baseUrl}/update-machine/`, machine, {headers});
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
