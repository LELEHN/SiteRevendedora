import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header'; // ⬅ ADICIONADO

interface Pagamento {
  _id?: string;
  cliente: string;
  valor: number;
  status: 'pago' | 'em-andamento' | 'pendente' | 'cancelado';
  dataPagamento: Date;
  metodoPagamento: string;
}

@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    HeaderComponent // ⬅ ADICIONADO AQUI
  ],
  templateUrl: './pagamentos.html',
  styleUrls: ['./pagamentos.css']
})
export class PagamentosComponent implements OnInit {
  pagamentos: Pagamento[] = [];
  filtroStatus: string = 'todos';
  pesquisa: string = '';
  
  private apiUrl = 'http://localhost:3000/api/pagamentos';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarPagamentos();
  }

  carregarPagamentos(): void {
    this.http.get<Pagamento[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.pagamentos = data;
      },
      error: (error) => {
        console.error('Erro ao carregar pagamentos:', error);
      }
    });
  }

  get pagamentosFiltrados(): Pagamento[] {
    let resultado = this.pagamentos;

    if (this.filtroStatus !== 'todos') {
      resultado = resultado.filter(p => p.status === this.filtroStatus);
    }

    if (this.pesquisa) {
      resultado = resultado.filter(p => 
        p.cliente.toLowerCase().includes(this.pesquisa.toLowerCase())
      );
    }

    return resultado;
  }

  get totalPago(): number {
    return this.pagamentos
      .filter(p => p.status === 'pago')
      .reduce((sum, p) => sum + p.valor, 0);
  }

  get totalEmAndamento(): number {
    return this.pagamentos
      .filter(p => p.status === 'em-andamento')
      .reduce((sum, p) => sum + p.valor, 0);
  }

  get totalPendente(): number {
    return this.pagamentos
      .filter(p => p.status === 'pendente')
      .reduce((sum, p) => sum + p.valor, 0);
  }

  atualizarStatus(id: string, novoStatus: string): void {
    this.http.patch(`${this.apiUrl}/${id}`, { status: novoStatus }).subscribe({
      next: () => {
        this.carregarPagamentos();
      },
      error: (error) => {
        console.error('Erro ao atualizar status:', error);
      }
    });
  }

  deletarPagamento(id: string): void {
    if (confirm('Deseja realmente excluir este pagamento?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.carregarPagamentos();
        },
        error: (error) => {
          console.error('Erro ao deletar pagamento:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pago': 'status-pago',
      'em-andamento': 'status-andamento',
      'pendente': 'status-pendente',
      'cancelado': 'status-cancelado'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pago': 'Pago',
      'em-andamento': 'Em andamento',
      'pendente': 'Pendente',
      'cancelado': 'Cancelado'
    };
    return labels[status] || status;
  }

  setFiltro(status: string): void {
    this.filtroStatus = status;
  }
}
