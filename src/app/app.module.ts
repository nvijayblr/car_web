import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { BreadcrumbComponent } from './breadcrumb.component';
import 'mdn-polyfills/Object.assign';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
// import { MaterialModule, MdDialogModule } from '@angular/material';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { _404Component } from './-404/-404.component';

import { MultiselectDropdownModule } from "assets/js/plugins/angular-2-dropdown-multiselect/src";
import { LoginService } from './services/login/login.service';
import { UrlgeneratorService } from './utill/urlgenerator/urlgenerator.service';
import { ApicallService } from './utill/apicall/apicall.service';
import { AdminusersService } from './services/home/adminusers.service';
import { DashboardService } from './services/home/dashboard.service';
import { CreatenewclaimService } from './services/home/createnewclaim.service';
import { CreatecapaService } from './services/home/createcapa.service';
import { CapaService } from './services/home/capa.service';
import { AuthService } from './services/auth/auth.service';
import { SharedService } from './services/home/shared.service';

import { DashboardComponent } from './home/dashboard/dashboard.component';
import { Constant } from './utill/constants/constant';
import { Languageconstant } from './utill/constants/languageconstant';
import { DialogComponent } from './common/dialog/dialog.component';
import { CreatenewclaimComponent } from './home/dashboard/claim/createnewclaim/createnewclaim.component';

import { RouterModule, Routes } from '@angular/router';

import { SqueezeBoxModule } from 'squeezebox';
import { MyDatePickerModule } from 'mydatepicker';

import { RespondComponent } from './home/dashboard/claim/respond/respond.component';
import { CapaComponent } from './home/dashboard/capa/capa/capa.component';
import { ClaimHomeComponent } from './home/dashboard/claim/claim-home/claim-home.component';
import { CapaHomeComponent } from './home/dashboard/capa/capa-home.component';
import { CapaSearchComponent } from './home/dashboard/capa/capa-search/capa-search.component';

import { NgxPopperModule } from 'ngx-popper';
import { TextMaskModule } from 'angular2-text-mask';

import { LandingComponent } from './landing/landing.component';
import { InternalModule } from './internal/internal.module';
import { LanguageModule } from './common/language/language.module';
import { SharedModule } from './common/shared/shared.module';
import { TimepickerModule, BsDatepickerModule, BsDropdownModule,
         PaginationModule, TooltipModule, TabsModule } from 'ngx-bootstrap';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { Numbers } from './common/directives/number.directive';
import { ExternalToasterService } from './services/external-toaster/external_toaster.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingComponent },
  { path: '404', component: _404Component },
  {
    path: 'dashboard', component: HomeComponent, canActivateChild: [AuthService],
    children: [
      { path: '', redirectTo: 'claim', pathMatch: 'full' },
      { path: 'claim', component: DashboardComponent,
        children:[
          { path: '', component: ClaimHomeComponent },
          { path: 'Createnewclaim/:id', component: CreatenewclaimComponent },
          { path: 'Viewclaim/:id', component: CreatenewclaimComponent },
          { path: 'Respond/:id/:status', component: RespondComponent },
          { path: 'CAPA/:id', component: CapaComponent }
        ]
      },
      { path: 'capa', component: CapaHomeComponent,
        children:[
         { path: '', component: CapaSearchComponent },
         { path: 'CAPA/:id', component: CapaComponent },
         { path: 'Viewclaim/:id', component: CreatenewclaimComponent },
         { path: 'Respond/:id/:status', component: RespondComponent }
        ]
       },
    ]
  },
  {path: '**', redirectTo: '404'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    BreadcrumbComponent,
    DialogComponent,
    CreatenewclaimComponent,
    RespondComponent,
    CapaComponent,
    ClaimHomeComponent,
    CapaHomeComponent,
    CapaSearchComponent,
    _404Component,
    LandingComponent,
    Numbers
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ToastModule.forRoot(),
    RouterModule.forRoot(routes, { useHash: true }),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    // MdDialogModule,
    // MaterialModule,
    AsyncLocalStorageModule,
    AngularMultiSelectModule,
    SqueezeBoxModule,
    MyDatePickerModule,
    CurrencyMaskModule,
    NgxPopperModule,
    TextMaskModule,
    MultiselectDropdownModule,
    InternalModule,
    LanguageModule,
    SharedModule,
    AngularDualListBoxModule
  ],
  providers: [LoginService, Constant, UrlgeneratorService, ApicallService, Languageconstant,
    AdminusersService, DashboardService, CreatenewclaimService,CreatecapaService, CapaService, AuthService,
    SharedService, ExternalToasterService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule { }
