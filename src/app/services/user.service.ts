import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/auth';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:8000'; // Bazowy adres API

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Pobierz dane użytkownika z serwera
  getUserData(userId : number): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}` // Dodaj token autoryzacyjny
    });
    
    return this.http.get<User>(`${this.baseUrl}/get-user-by-id/${userId}`, { headers });
  }

  // Aktualizuj dane użytkownika na serwerze
  updateUserData(userData: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}` // Dodaj token autoryzacyjny
    });

    return this.http.put(`${this.baseUrl}/edit-user/${userData.Id}/`, userData, { headers });
  }

  deactivateUser(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}` // Dodaj token autoryzacyjny
    });
    return this.http.put<any>(`${this.baseUrl}/disable-user/`, { Id: userId }, { headers });
  }

  activateUser(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}` // Dodaj token autoryzacyjny
    });
    return this.http.put<any>(`${this.baseUrl}/enable-user/`, { Id: userId }, { headers });
  }
  // Pobierz token autoryzacyjny z sesji
  private getAuthToken(): string {
    return sessionStorage.getItem('jwt_token') || ''; // Sprawdź, czy token istnieje w sesji
  }
  getAllUsers(): Observable<User[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}` // Dodaj token autoryzacyjny
    });
    return this.http.get<User[]>(`${this.baseUrl}/get-all-users/`, { headers });
  }
}
