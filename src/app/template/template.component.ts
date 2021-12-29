import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Formulario } from '../model';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent {

  @Input() formulario: Formulario;

  @ViewChild('pdfTemplate') pdfTemplate: ElementRef;

  constructor(
    public _DomSanitizer: DomSanitizer,
  ) { }

  gerarPdf(){
    var innerHTML = this.pdfTemplate.nativeElement.innerHTML;

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
}
