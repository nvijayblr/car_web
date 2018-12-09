import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from './services/shared/shared.service';

@Component({
  selector: 'app-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.css']
})
export class InternalComponent implements OnInit {
    public curentPage:string;
    constructor (
        private sharedService: SharedService,
        translate: TranslateService, 
        private cdRef: ChangeDetectorRef
    ) { 
        sharedService.changeEmitted$.subscribe(data => {
            this.curentPage = data.current_page;
        })
        translate.setDefaultLang('en-US');
        translate.use(localStorage.getItem("lang") ? localStorage.getItem("lang") : 'en-US');
    }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
}
