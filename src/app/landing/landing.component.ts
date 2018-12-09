import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth/auth.service';
import { PlatformLocation } from "@angular/common";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
	public moduleWeightage = {
		CLMCR: 0,
		CLMRESCAPA: 0,
		ICLMCR: 0,
		ICLMRESCAPA: 0
	}
	constructor(
		translate: TranslateService,
		private authService: AuthService,
		private location: PlatformLocation
	) { 
		translate.setDefaultLang('en-US');
		translate.use(localStorage.getItem("lang") ? localStorage.getItem("lang") : 'en-US');

		history.pushState(null, null, window.location.href);
	    location.onPopState(() => {
	        history.go(1);
	        return false;
	    });
	}

	ngOnInit() {
		/*Get the ModuleTransaction Weightage*/
		this.moduleWeightage.CLMCR = this.authService.getTransactionWeightage('CLMCR');
		this.moduleWeightage.CLMRESCAPA = this.authService.getTransactionWeightage('CLMRESCAPA');
		this.moduleWeightage.ICLMCR = this.authService.getTransactionWeightage('ICLMCR');
		this.moduleWeightage.ICLMRESCAPA = this.authService.getTransactionWeightage('ICLMRESCAPA');
	}

}
