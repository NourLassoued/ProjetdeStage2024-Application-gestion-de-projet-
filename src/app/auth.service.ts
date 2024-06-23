import { Injectable } from '@angular/core';
import { Utilisateur } from 'src/models/Utilisateur';
import {BehaviorSubject, map, Observable} from "rxjs";
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userSubject: BehaviorSubject<Utilisateur | null>;
  public user: Observable<Utilisateur | null>;
  isconn: any=false;
  private baseUrl = 'http://localhost:8087/nour/api/v1/auth';

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }
  public get userValue() {
    return this.userSubject.value;
  }
  logout(): void {
    // Supprimer les informations d'authentification stockées localement
    localStorage.removeItem('user'); // ou sessionStorage.removeItem('user');
    localStorage.removeItem('access_token'); // Supprimer le token d'accès JWT
    localStorage.removeItem('refreshToken'); // Supprimer le refresh token si nécessaire
    this.router.navigate(['/login']); // Rediriger vers la page de connexion
  }


  register(data: any) {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }
  getAuthToken(): string {
    const token = localStorage.getItem('access_token');
    console.log('SERVICE token is' + token)

    return token || 'EMPTY';
  }
  getAccessToken(): string {
    return localStorage.getItem('accessToken')!;
  }

  authenticate(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.baseUrl}/authenticate`, body);
  }

  refreshToken(refreshToken: string): Observable<any> {
    const body = { refreshToken };
    return this.http.post<any>(`${this.baseUrl}/refreshToken`, body);
  }

  isLoggedIn(): boolean {
    // Vérifiez ici si l'utilisateur est authentifié
    const token = localStorage.getItem('access_token');
    return !!token; // Retourne true si le token existe, false sinon
  }
  
}
