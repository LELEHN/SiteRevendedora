import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

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

  constructor(private authService: AuthService) {}

  alternarModo() {
    this.modoCadastro = !this.modoCadastro;
  }

  onLogin() {
    this.authService.login(this.email, this.senha).subscribe({
      next: (res) => {
        alert(res.mensagem);
        localStorage.setItem('token', res.token);
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
