import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Tableau } from 'src/models/Tableau';

@Injectable({
  providedIn: 'root'
})
export class TableauxService {
  private baseUrl = 'http://localhost:8087/nour/api/v1/auth';
  constructor(private http: HttpClient, private router: Router) { } 
  createTableau(id: number, tableau: Tableau): Observable<Tableau> {
    const url = `${this.baseUrl}/tableaux/${id}`;
    return this.http.post<Tableau>(url, tableau);
  }
  getTableauxByUtilisateur(id: number): Observable<Tableau[]> {
    const url = `${this.baseUrl}/tableaux/utilisateur/${id}`;
    return this.http.get<Tableau[]>(url);
  }
}


