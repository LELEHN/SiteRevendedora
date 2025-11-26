import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { HeaderComponent } from "../header/header"; // ✅ importa corretamente

@Component({
  selector: 'app-adm',
  standalone: true, // 🔹 importante se for standalone
  templateUrl: './adm.html',
  styleUrls: ['./adm.css'] // 🔹 styleUrls (no plural)
  ,
  imports: [HeaderComponent]
})
export class Adm implements OnInit {
  nome = '';

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.nome = decoded.nome || decoded.name || decoded.email || 'Usuário';
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
  }
}
