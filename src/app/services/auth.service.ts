// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000'; // URL do seu servidor Node

    constructor(private http: HttpClient) { }

    login(email: string, senha: string): Observable<any> {
        return this.http.post('http://localhost:5010/usuario/login', { email, senha });
    }

    cadastrar(nome: string, email: string, senha: string): Observable<any> {
  return this.http.post('http://localhost:5010/usuario/cadastro', {
    nome,
    email,
    senha
  });
}


}



