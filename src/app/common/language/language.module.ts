import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Http, Response } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/languages/', '.json');
}


@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    })
  ],
  declarations: [],
  exports: [
  	TranslateModule
  ]
})

export class LanguageModule { }
