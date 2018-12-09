import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from '.././services/auth/auth.service';
import { ModalModule } from 'ngx-bootstrap';

import { InternalComponent } from './internal.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClaimComponent } from './claim/claim.component';
import { SearchClaimComponent } from './claim/search/search-claim.component';
import { AccidentComponent } from './claim/accident/accident.component';
import { HazardComponent } from './claim/hazard/hazard.component';
import { ViewComponent } from './claim/view/view.component';
import { CapaComponent } from './capa/capa.component';
import { HeaderComponent } from '.././common/header/header.component';

import { LanguageModule } from '.././common/language/language.module';
import { SharedModule } from '../common/shared/shared.module';
import { InternalService } from './services/internal/internal.service';
import { SharedService } from './services/shared/shared.service';
import { AccidentService } from './services/accident/accident.service';

import { TimepickerModule, BsDatepickerModule, BsDropdownModule, PaginationModule} from 'ngx-bootstrap';
import { Ng2ScrollableModule } from 'ng2-scrollable';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HazardsService } from './services/hazard/hazards.service';
import { ViewHazardComponent } from './claim/view/view-hazard/view-hazard.component';



const InternalRoutes: Routes = [{
  path: 'internal', component:InternalComponent, canActivateChild: [AuthService],
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'claim', component: ClaimComponent,
      children: [
        { path: '', component: SearchClaimComponent },
        { path: 'search', component: SearchClaimComponent },
        { path: 'view/:type/:claimId', component: ViewComponent },
        { path: 'accident/:mode', component: AccidentComponent },
        { path: 'hazard/:mode', component: HazardComponent },
        { path: 'hazardview/:mode', component: ViewHazardComponent },
        { path: 'hazard/:type/:claimId', component: ViewHazardComponent }
      ]
    },
    { path: 'capa', component: CapaComponent},
  ]
}];

@NgModule({
  declarations: [
    InternalComponent,
    DashboardComponent,
    ClaimComponent,
    CapaComponent,
    SearchClaimComponent,
    AccidentComponent,
    HazardComponent,
    ViewComponent,
    HeaderComponent,
    ViewHazardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(InternalRoutes, { useHash: true }),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    NgbModule.forRoot(),
    LanguageModule,
    SharedModule,
    Ng2ScrollableModule
  ],
  exports: [
    HeaderComponent
  ],
  providers: [
    InternalService,
    SharedService,
    AccidentService,
    HazardsService
    ],
  bootstrap: [],
  entryComponents: []
})

export class InternalModule { }
