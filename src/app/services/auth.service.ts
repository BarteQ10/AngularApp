import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, Register, User } from '../interfaces/auth';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000'
  constructor(private http: HttpClient) { }

  registerUser(registerData: Register): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post<any>(`${this.baseUrl}/register/`, registerData, { headers });
  }

  login(loginData: Login): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    return this.http.post(`${this.baseUrl}/login/`, loginData, { headers });
  }

  disableUser(): Observable<any> {
    
    const token = sessionStorage.getItem('jwt_token');
    const id = this.getUserId(token);
    const body = { Id: id };
    const headers = new HttpHeaders({
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
      });

    return this.http.put(`${this.baseUrl}/disable-user/`, body, { headers });
  }
  getUserId(token: string|null){

  let payload;
  if (token) {
    payload = token.split(".")[1];
    payload = window.atob(payload);
    //return JSON.parse(payload);
    return JSON.parse(payload).Id
  } else {
    return null;
  }
  }
}
