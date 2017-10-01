import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../categorias/categoria.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { PessoaService } from '../../pessoas/pessoa.service';
import { Lancamento } from '../../core/model';
import { FormControl } from '@angular/forms';
import { LancamentoService } from '../lancamento.service';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/components/common/api';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita' , value: 'RECEITA' },
    { label: 'Despesa' , value: 'DESPESA' }
  ];

  categorias = [ ];
  pessoas = [ ];
  lancamento = new Lancamento();

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private toasty: ToastyService,
    private erroHandler: ErrorHandlerService,
    private rotaAtiva: ActivatedRoute,
    private rota: Router,
    private confirmation: ConfirmationService
  ) { }

  ngOnInit() {
    const codigoLancamento = this.rotaAtiva.snapshot.params['codigo'];

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        this.lancamento = lancamento;
      })
      .catch(erro => this.erroHandler.handle(erro));
  }

  get editando(): boolean {
    return Boolean(this.lancamento.codigo);
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(lancamentoAdicionado => {
        this.toasty.success('Lançamento salvo com sucesso!');

        // form.reset();
        // this.lancamento = new Lancamento();

        this.continuaIncluindo(form, lancamentoAdicionado);
      })
      .catch(erro => this.erroHandler.handle(erro));
  }

  atualizarLancamento(form: FormControl) {
    this.lancamentoService.atualizar(this.lancamento)
      .then(lancamento => {
        this.lancamento = lancamento;

        this.toasty.success('Lançamento alterado com sucesso!');
      })
      .catch(erro => this.erroHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }));
      })
      .catch(erro => this.erroHandler.handle(erro));
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.map(p => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.erroHandler.handle(erro));
  }

  continuaIncluindo(form: FormControl, lancamentoAdicionado: Lancamento) {
    this.confirmation.confirm( {
      message: 'Deseja continuar incluindo ?',
      accept: () => {
        this.novo(form);
      },
      reject: () => {
        this.rota.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
      }
    } );
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function(){
      this.lancamento = new Lancamento();
    }.bind(this), 1);

    this.rota.navigate(['/lancamentos/novo']);
  }
}
