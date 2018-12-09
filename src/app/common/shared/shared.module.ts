import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterPipe, InitiatorPhone, SpaceToHyphen } from '../../common/filters/data-filter.pipe';
import { DataTableModule } from "angular2-datatable";
import { LoaderComponent } from '../../common/loader/loader.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule
  ],
  declarations: [
    LoaderComponent,
    DataFilterPipe,
    SpaceToHyphen,
    InitiatorPhone
  ],
  exports: [
    FileUploadModule,
    LoaderComponent,
  	DataFilterPipe,
    InitiatorPhone,
    SpaceToHyphen,
    DataTableModule,
    NgSelectModule
  ]
})
export class SharedModule { }
