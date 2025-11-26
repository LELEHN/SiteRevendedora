import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


interface DecodedToken {
  id: number;
  email: string;
  cargo: string;
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  modoCadastro = false;
  nome = '';
  email = '';
  senha = '';

  //injeta o Router aqui
  constructor(private authService: AuthService, private router: Router) {}

  alternarModo() {
    this.modoCadastro = !this.modoCadastro;
  }

  onLogin() {
    this.authService.login(this.email, this.senha).subscribe({
      next: (res) => {
        alert(res.mensagem);
        localStorage.setItem('token', res.token);

        try {
          // ✅ decodifica o token recebido
          const decoded = jwtDecode<DecodedToken>(res.token);

          // ✅ verifica o cargo e redireciona
          if (decoded.cargo === 'ADM') {
            this.router.navigate(['/adm']);
          } else {
            this.router.navigate(['/']);
          }
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        alert(err.error?.erro || 'Falha no login');
      }
    });
  }

  onCadastrar() {
    this.authService.cadastrar(this.nome, this.email, this.senha).subscribe({
      next: (res) => {
        alert(res.mensagem);
        this.modoCadastro = false;
      },
      error: (err) => {
        alert(err.error?.erro || 'Erro ao cadastrar usuário');
      }
    });
  }
}
