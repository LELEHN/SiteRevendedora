import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header";

interface Produto {
  id: number;
  nome: string;
  estoque: number;
  unidade: string;
  imagem: string;
}

@Component({
  selector: 'app-gerenciar-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './gerenciar-produtos.html',
  styleUrls: ['./gerenciar-produtos.css']
})
export class GerenciarProdutosComponent implements OnInit {
  produtos: Produto[] = [
    {
      id: 1,
      nome: "Combo Nativa SPA",
      estoque: 10,
      unidade: "un",
      imagem: "/Body Splash Desodorante Nativa SPA Orquídea Lumière 200ml.png"
    },
    {
      id: 2,
      nome: "Eudora máscara capilar",
      estoque: 10,
      unidade: "un",
      imagem: "Refil Máscara Capilar Siàge Hair-Plastia 250g.png"
    },
    {
      id: 3,
      nome: "Egeo Dolce Desodorante Colônia 90ml",
      estoque: 5,
      unidade: "un",
      imagem: "Egeo Dolce Desodorante Colônia 90ml.webp"
    }
  ];

  produtosFiltrados: Produto[] = [];
  mostrarModal: boolean = false;
  modoEdicao: boolean = false;
  produtoAtual: Produto | null = null;
  busca: string = '';

  formulario = {
    nome: '',
    estoque: 0,
    unidade: 'un',
    imagem: ''
  };

  unidades: string[] = ['un', 'ml', 'g', 'kg'];

  constructor() { }

  ngOnInit(): void {
    this.produtosFiltrados = [...this.produtos];
  }

  buscarProduto(): void {
    if (this.busca.trim() === '') {
      this.produtosFiltrados = [...this.produtos];
    } else {
      this.produtosFiltrados = this.produtos.filter(p => 
        p.nome.toLowerCase().includes(this.busca.toLowerCase())
      );
    }
  }

  abrirModalAdicionar(): void {
    this.modoEdicao = false;
    this.produtoAtual = null;
    this.formulario = {
      nome: '',
      estoque: 0,
      unidade: 'un',
      imagem: ''
    };
    this.mostrarModal = true;
  }

  abrirModalEditar(produto: Produto): void {
    this.modoEdicao = true;
    this.produtoAtual = produto;
    this.formulario = {
      nome: produto.nome,
      estoque: produto.estoque,
      unidade: produto.unidade,
      imagem: produto.imagem
    };
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.formulario = {
      nome: '',
      estoque: 0,
      unidade: 'un',
      imagem: ''
    };
  }

  salvarProduto(): void {
    if (!this.formulario.nome || !this.formulario.imagem) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (this.modoEdicao && this.produtoAtual) {
      // Editar produto existente
      const index = this.produtos.findIndex(p => p.id === this.produtoAtual!.id);
      if (index !== -1) {
        this.produtos[index] = {
          id: this.produtoAtual.id,
          nome: this.formulario.nome,
          estoque: this.formulario.estoque,
          unidade: this.formulario.unidade,
          imagem: this.formulario.imagem
        };
      }
    } else {
      // Adicionar novo produto
      const novoProduto: Produto = {
        id: Date.now(),
        nome: this.formulario.nome,
        estoque: this.formulario.estoque,
        unidade: this.formulario.unidade,
        imagem: this.formulario.imagem
      };
      this.produtos.push(novoProduto);
    }

    this.buscarProduto();
    this.fecharModal();
  }

  removerProduto(id: number): void {
    if (confirm('Deseja realmente remover este produto?')) {
      this.produtos = this.produtos.filter(p => p.id !== id);
      this.buscarProduto();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Aqui você pode implementar o upload da imagem
      // Por enquanto, vamos usar uma URL de placeholder
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formulario.imagem = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}