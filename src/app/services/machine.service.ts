import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ChamberData, Machine, MachineFillStatusResponse } from '../interfaces/machine';
import { ApiConfig } from '../../config/api-config'

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private baseUrl = ApiConfig.apiUrl;
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

  getMachineFillStatus(): Observable<MachineFillStatusResponse[]> {
    const headers = this.createHeaders();
    return this.http.get<MachineFillStatusResponse[]>(`${this.baseUrl}/get-machine-fill-status/`, {headers});
  }
  assignMachineTo(machine_id:number, id_machine_type:number): Observable<any>{
    const headers = this.createHeaders();
    return this.http.post(`${this.baseUrl}/assign-machine/`, {machine_id:machine_id, id_machine_type:id_machine_type}, {headers});
  }
  unAssignMachineFrom(machine_id:number, id_machine_type:number): Observable<any>{
    const headers = this.createHeaders();
    return this.http.post(`${this.baseUrl}/unassign-machine/`, {machine_id:machine_id, id_machine_type:id_machine_type}, {headers});
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
