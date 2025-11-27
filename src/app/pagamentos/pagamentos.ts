import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header";

interface Pagamento {
  id: number;
  clienteNome: string;
  valor: number;
  status: 'pago' | 'em_andamento' | 'pendente';
  data: Date;
  produtos: string[];
}

@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './pagamentos.html',
  styleUrls: ['./pagamentos.css']
})
export class PagamentosComponent implements OnInit {
  pagamentos: Pagamento[] = [];
  
  pagamentosFiltrados: Pagamento[] = [];
  filtroAtivo: string = 'todos';
  busca: string = '';

  constructor() { }

  ngOnInit(): void {
    this.filtrarPagamentos();
  }

  // Calcula os totais por status
  getTotalPago(): number {
    return this.pagamentos
      .filter(p => p.status === 'pago')
      .reduce((total, p) => total + p.valor, 0);
  }

  getTotalEmAndamento(): number {
    return this.pagamentos
      .filter(p => p.status === 'em_andamento')
      .reduce((total, p) => total + p.valor, 0);
  }

  getTotalPendente(): number {
    return this.pagamentos
      .filter(p => p.status === 'pendente')
      .reduce((total, p) => total + p.valor, 0);
  }

  // Filtrar pagamentos
  filtrarPagamentos(): void {
    let resultado = [...this.pagamentos];

    // Filtro por status
    if (this.filtroAtivo !== 'todos') {
      resultado = resultado.filter(p => p.status === this.filtroAtivo);
    }

    // Filtro por busca
    if (this.busca.trim() !== '') {
      resultado = resultado.filter(p => 
        p.clienteNome.toLowerCase().includes(this.busca.toLowerCase())
      );
    }

    this.pagamentosFiltrados = resultado;
  }

  // Mudar filtro ativo
  mudarFiltro(filtro: string): void {
    this.filtroAtivo = filtro;
    this.filtrarPagamentos();
  }

  // Verificar se filtro está ativo
  isFiltroAtivo(filtro: string): boolean {
    return this.filtroAtivo === filtro;
  }

  // Formatar valor em Real
  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // Obter classe CSS do status
  getStatusClass(status: string): string {
    switch(status) {
      case 'pago': return 'status-pago';
      case 'em_andamento': return 'status-andamento';
      case 'pendente': return 'status-pendente';
      default: return '';
    }
  }

  // Obter texto do status
  getStatusTexto(status: string): string {
    switch(status) {
      case 'pago': return 'Pago';
      case 'em_andamento': return 'Em andamento';
      case 'pendente': return 'Pendente';
      default: return '';
    }
  }
}