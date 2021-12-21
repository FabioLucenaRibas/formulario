import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Formulario } from '../model';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  @Input() formulario: Formulario;

  @ViewChild('pdfTemplate') pdfTemplate: ElementRef;

  constructor(
    public _DomSanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

}
