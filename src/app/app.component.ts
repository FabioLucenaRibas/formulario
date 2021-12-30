import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TemplateComponent } from './template/template.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import {
  ConfirmationService,
  MenuItem,
  MessageService,
  PrimeNGConfig
} from 'primeng/api';
import { Formulario } from './model/formulario.model';
import { Cliente } from './model/cliente.model';
import { Utils } from './utils/Utils';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  @ViewChild('pdfTemplate', { static: false }) templateComponent: TemplateComponent;
  @ViewChild('formFormulario', { static: true }) formFormulario: NgForm;

  title = 'CIVPRO';
  items: MenuItem[];
  estadoCivilOpcoes: any[];
  formulario = new Formulario();


  constructor(
    public domSanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {
    this.estadoCivilOpcoes = [
      { label: 'Solteiro', value: 'Solteiro' },
      { label: 'Casado', value: 'Casado' },
      { label: 'Outros', value: 'Outros' }
    ];
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    console.log(this.formulario);

    this.items = [
      {
        id: 'novo',
        label: 'Novo',
        icon: 'pi pi-fw pi-plus',
        command: (event: Event) => { this.confirmaNovoFormulario(event); }
      },
      {
        id: 'carregar',
        label: 'Carregar',
        icon: 'pi pi-fw pi-upload',
      },
      {
        id: 'salvar',
        label: 'Salvar',
        icon: 'pi pi-fw pi-save',
        command: (event: Event) => { this.baixarFormulario(); }
      },
      {
        id: 'exportar',
        label: 'Exportar',
        icon: 'pi pi-fw pi-file-pdf',
        target: 'file',
        command: (event: Event) => { this.exportar(event); }
      }
    ];
  }

  activeMenu(event) {
    if (event.target.id === 'carregar'){
      const file = document.getElementById('file');
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false
      });
      file.dispatchEvent(clickEvent);
    }
  }

  carregarFormulario(files: FileList) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.formulario = JSON.parse(fileReader.result.toString());

      for (const cliente of this.formulario.dadosClientes) {
        cliente.dados.dataNascimento = new Date(cliente.dados.dataNascimento);
      }
    };
    fileReader.readAsText(files.item(0));
  }

  baixarFormulario() {
    const filename = new Date().toLocaleString() + '.json';
    const filetype = 'text/plain';

    const a = document.createElement('a');
    const json = JSON.stringify(this.formulario);
    const dataURI = 'data:' + filetype + ';base64,' + this.b64EncodeUnicode(json);
    a.href = dataURI;
    a.download = filename;

    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false
    });
    a.dispatchEvent(clickEvent);
    a.remove();
  }

  exportar(event: Event) {
    if (!this.formFormulario.form.valid) {
      this.confirmarExporta(event);
    } else {
      this.gerarPdf();
    }
  }

  gerarPdf() {
    console.log(this.formulario);
    this.templateComponent.gerarPdf();
  }

  confirmaNovoFormulario(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      header: 'Atenção',
      message: 'Tem certeza de que deseja continuar? \nO formulário atual será descartado.',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Não',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      acceptIcon: 'pi pi-check',
      defaultFocus: 'reject',
      acceptButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.formulario = new Formulario();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Um novo formulario foi gerado.'
        });
      }
    });
  }

  confirmarExporta(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      header: 'Atenção',
      message: 'Ainda possui campos obrigatórios não preenchidos.\nDeseja continuar?',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Não',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      acceptIcon: 'pi pi-check',
      defaultFocus: 'reject',
      acceptButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        this.gerarPdf();
      }
    });
  }

  uploadLogo(files: FileList) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.formulario.imagem = 'data:image/png;base64, ' + btoa(fileReader.result.toString());
    };
    fileReader.readAsBinaryString(files.item(0));
  }

  gerarCliente2() {
    const clientes = this.formulario.dadosClientes;

    const primeiroCliente = clientes[0];
    delete primeiroCliente.dados.estadocivilespecifico;
    delete primeiroCliente.dados.regimeComunhao;

    if (clientes.length > 1) {
      clientes.splice(2, 1);
    } else {
      clientes.push(new Cliente());
    }
  }

  validarCpf(event: any) {
    const name = event.target.attributes['ng-reflect-name'].value;

    if (Utils.validateCPF(event.target.value)) {
      this.formFormulario.form.controls[name].setErrors(null);
    } else {
      this.formFormulario.form.controls[name].setErrors({ incorrect: true });
    }
  }

  b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      const charset = '0x' + p1;
      return String.fromCharCode(parseInt(charset, 16));
    }));
  }
}
