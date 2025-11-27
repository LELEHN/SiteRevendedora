import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header";

interface Pagamento {
  id: number;
  clienteId: number;
  valor: number;
  status: 'pago' | 'em_andamento' | 'pendente';
  data: Date;
  quantidadeProdutos: number;
}

interface Cliente {
  id: number;
  nome: string;
  totalCompras: number;
  foto?: string;
  comprasFinalizadasMesAtual?: number;
}

@Component({
  selector: 'app-gerenciar-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './gerenciar-clientes.html',
  styleUrls: ['./gerenciar-clientes.css']
})
export class GerenciarClientesComponent implements OnInit {
  // Dados de exemplo de pagamentos (aqui você integraria com seu serviço real)
  pagamentos: Pagamento[] = [];

  clientes: Cliente[] = [];

  clientesFiltrados: Cliente[] = [];
  mostrarModal: boolean = false;
  modoEdicao: boolean = false;
  clienteAtual: Cliente | null = null;
  busca: string = '';

  formulario = {
    nome: '',
    totalCompras: 0,
    foto: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.calcularComprasFinalizadasMesAtual();
    this.filtrarClientes();
  }

  // Calcula quantos produtos finalizados (pagos) cada cliente comprou no mês atual
  calcularComprasFinalizadasMesAtual(): void {
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();

    this.clientes = this.clientes.map(cliente => {
      // Filtra pagamentos do cliente que estão pagos e são do mês atual
      const pagamentosFinalizadosMesAtual = this.pagamentos.filter(pagamento => {
        const dataPagamento = new Date(pagamento.data);
        return (
          pagamento.clienteId === cliente.id &&
          pagamento.status === 'pago' &&
          dataPagamento.getMonth() === mesAtual &&
          dataPagamento.getFullYear() === anoAtual
        );
      });

      // Soma a quantidade de produtos de todos os pagamentos finalizados do mês
      const totalProdutosMesAtual = pagamentosFinalizadosMesAtual.reduce(
        (total, pagamento) => total + pagamento.quantidadeProdutos,
        0
      );

      return {
        ...cliente,
        comprasFinalizadasMesAtual: totalProdutosMesAtual
      };
    });
  }

  filtrarClientes(): void {
    let resultado = [...this.clientes];

    // Filtro por busca
    if (this.busca.trim() !== '') {
      resultado = resultado.filter(c => 
        c.nome.toLowerCase().includes(this.busca.toLowerCase())
      );
    }

    this.clientesFiltrados = resultado;
  }

  abrirModalAdicionar(): void {
    this.modoEdicao = false;
    this.clienteAtual = null;
    this.formulario = {
      nome: '',
      totalCompras: 0,
      foto: ''
    };
    this.mostrarModal = true;
  }

  abrirModalEditar(cliente: Cliente): void {
    this.modoEdicao = true;
    this.clienteAtual = cliente;
    this.formulario = {
      nome: cliente.nome,
      totalCompras: cliente.totalCompras,
      foto: cliente.foto || ''
    };
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.formulario = {
      nome: '',
      totalCompras: 0,
      foto: ''
    };
  }

  salvarCliente(): void {
    if (!this.formulario.nome) {
      alert('Por favor, preencha o nome do cliente');
      return;
    }

    if (this.modoEdicao && this.clienteAtual) {
      // Editar cliente existente
      const index = this.clientes.findIndex(c => c.id === this.clienteAtual!.id);
      if (index !== -1) {
        this.clientes[index] = {
          id: this.clienteAtual.id,
          nome: this.formulario.nome,
          totalCompras: this.formulario.totalCompras,
          foto: this.formulario.foto || this.gerarFotoAvatar(this.formulario.nome)
        };
      }
    } else {
      // Adicionar novo cliente
      const novoCliente: Cliente = {
        id: Date.now(),
        nome: this.formulario.nome,
        totalCompras: this.formulario.totalCompras,
        foto: this.formulario.foto || this.gerarFotoAvatar(this.formulario.nome)
      };
      this.clientes.push(novoCliente);
    }

    this.filtrarClientes();
    this.fecharModal();
  }

  removerCliente(id: number): void {
    if (confirm('Deseja realmente remover este cliente?')) {
      this.clientes = this.clientes.filter(c => c.id !== id);
      this.filtrarClientes();
    }
  }

  gerarFotoAvatar(nome: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=ec4899&color=fff&size=200`;
  }
}