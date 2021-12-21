import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ToolbarModule } from 'primeng/toolbar';

import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ToastModule } from "primeng/toast";
import { ConfirmationService, MessageService } from "primeng/api";

import {CardModule} from 'primeng/card';
import {AccordionModule} from 'primeng/accordion';
import {InputTextModule} from 'primeng/inputtext';
import {ImageModule} from 'primeng/image';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputMaskModule} from 'primeng/inputmask';
import {CalendarModule} from 'primeng/calendar';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

import { AppComponent } from './app.component';
import { TemplateComponent } from './template/template.component';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';

const maskConfig: Partial<IConfig> = {
    validation: true,
  };

  registerLocaleData(localePt);

@NgModule({
    declarations: [
        AppComponent,
        TemplateComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        TableModule,
        DialogModule,
        ToolbarModule,
        ConfirmDialogModule,
        RatingModule,
        InputNumberModule,
        InputTextareaModule,
        DropdownModule,

        ConfirmPopupModule,
        ToastModule,
        ButtonModule,
        CardModule,
        AccordionModule,
        InputTextModule,
        ImageModule,
        FileUploadModule,
        HttpClientModule,
        RadioButtonModule,
        InputMaskModule,
        CalendarModule,
        MessagesModule,
        MessageModule,
        NgxMaskModule.forRoot(maskConfig),
    ],
    providers: [ConfirmationService, MessageService, { provide: LOCALE_ID, useValue: 'pt-BR' } ],
    bootstrap: [AppComponent]
})
export class AppModule { }
