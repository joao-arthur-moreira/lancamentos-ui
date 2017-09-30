import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { ToastyService } from 'ng2-toasty';

@Injectable()
export class ErrorHandlerService {

  constructor(private toasty: ToastyService) { }

  handle(erroResponse: any) {
    let msg: string;

    if (typeof erroResponse === 'string') {
      msg = erroResponse;
    } else if (erroResponse instanceof Response && erroResponse.status >= 400 && erroResponse.status <= 499) {
      let erros;
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      try {
        erros = erroResponse.json();
        msg = erros[0].mensagemUsuario;
      } catch (e) {

      }

      console.error('Ocorreu um erro', erroResponse);
    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', erroResponse);
    }

    this.toasty.error(msg);
  }

}
