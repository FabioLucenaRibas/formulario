import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ConfirmationService,
  MenuItem,
  MessageService,
  PrimeNGConfig
} from 'primeng/api';
import { Cliente } from './model/cliente.model';
import { Formulario } from './model/formulario.model';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TemplateComponent } from './template/template.component';
import { Utils } from './utils/Utils';
import { NgForm } from '@angular/forms';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'CIVPRO';
  items: MenuItem[];
  estadoCivilOpcoes: any[];
  formulario = new Formulario();

  @ViewChild('pdfTemplate', { static: false }) templateComponent: TemplateComponent;
  @ViewChild('formFormulario', { static: true }) formFormulario: NgForm;

  constructor(
    public _DomSanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) { 
    this.estadoCivilOpcoes = [
      { label: "Solteiro", value: "Solteiro" },
      { label: "Casado", value: "Casado" },
      { label: "Outros", value: "Outros" }
    ];
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    console.log(this.formulario);

    this.items = [
      {
        id: "novo",
        label: 'Novo',
        icon: 'pi pi-fw pi-plus',
        command: (event: Event) => { this.confirmaNovoFormulario(event) }
      },
      {
        id: "carregar",
        label: 'Carregar',
        icon: 'pi pi-fw pi-upload',
      },
      {
        id: "salvar",
        label: 'Salvar',
        icon: 'pi pi-fw pi-save',
        command: (event: Event) => { this.baixarFormulario() }
      },
      {
        id: "exportar",
        label: 'Exportar',
        icon: 'pi pi-fw pi-file-pdf',
        target: "file",
        command: (event: Event) => { this.exportar(event) }
      }
    ];
  }

  activeMenu(event) {
    if (event.target.id === "carregar"){
      let file = document.getElementById("file");
      var clickEvent = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": false
      });
      file.dispatchEvent(clickEvent);
    }
  }

  gerarCliente2() {
    let clientes = this.formulario.dadosClientes;

    let primeiroCliente = clientes[0];
    delete primeiroCliente.dados.estadocivilespecifico
    delete primeiroCliente.dados.regimeComunhao

    if (clientes.length > 1) {
      clientes.splice(2, 1);
    } else {
      clientes.push(new Cliente())
    }
  }

  confirmaNovoFormulario(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      header: "Atenção",
      message: "Tem certeza de que deseja continuar? \nO formulário atual será descartado.",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Não",
      rejectIcon: "pi pi-times",
      acceptLabel: "Sim",
      acceptIcon: "pi pi-check",
      defaultFocus: "reject",
      acceptButtonStyleClass: "p-button-text p-button-secondary",
      accept: () => {
        this.formulario = new Formulario();

        this.messageService.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Um novo formulario foi gerado."
        });
      }
    });
  }

  carregarFormulario(files: FileList) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.formulario = JSON.parse(fileReader.result.toString());

      for (var cliente of this.formulario.dadosClientes) {
        cliente.dados.dataNascimento = new Date(cliente.dados.dataNascimento);
      }
    }
    fileReader.readAsText(files.item(0));
  }

  baixarFormulario() {
    var filename = new Date().toLocaleString() + ".json";
    var filetype = "text/plain";

    var a = document.createElement("a");
    var json = JSON.stringify(this.formulario);
    var dataURI = "data:" + filetype + ";base64," + this.b64EncodeUnicode(json);
    a.href = dataURI;
    a['download'] = filename;

    var clickEvent = new MouseEvent("click", {
      "view": window,
      "bubbles": true,
      "cancelable": false
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

    var innerHTML = this.templateComponent.pdfTemplate.nativeElement.innerHTML;

    var options = {
      defaultStyles: {
        table: { margin: [-5, 0, 0, 0] }
      }
    }

    var html = htmlToPdfmake(innerHTML, options);

    var documentDefinition = {
      content: html,

      // a string or { width: number, height: number }
      pageSize: 'B4',

      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'portrait',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [35, 30, 30, 25],

      pageNumbers: [1]
    };

    pdfMake.createPdf(documentDefinition).open();
  }

  confirmarExporta(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      header: "Atenção",
      message: "Ainda possui campos obrigatórios não preenchidos.\nDeseja continuar?",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Não",
      rejectIcon: "pi pi-times",
      acceptLabel: "Sim",
      acceptIcon: "pi pi-check",
      defaultFocus: "reject",
      acceptButtonStyleClass: "p-button-text p-button-secondary",
      accept: () => {
        this.gerarPdf();
      }
    });
  }

  uploadLogo(files: FileList) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.formulario.imagem = "data:image/png;base64, " + btoa(fileReader.result.toString());
    }
    fileReader.readAsBinaryString(files.item(0));
  }

  validarCpf(event: any) {
    var name = event.target.attributes['ng-reflect-name'].value;

    if (Utils.validateCPF(event.target.value)) {
      this.formFormulario.form.controls[name].setErrors(null);
    } else {
      this.formFormulario.form.controls[name].setErrors({ 'incorrect': true });
    }
  }

  b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      var charset = "0x" + p1;
      return String.fromCharCode(parseInt(charset));
    }));
  }
}
