import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import { Constant } from '../utill/constants/constant';
import { UrlgeneratorService } from '../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../utill/apicall/apicall.service';
import { CreatenewclaimService } from '../services/home/createnewclaim.service';
import { MenuItem } from 'primeng/primeng';
import { Languageconstant } from '../utill/constants/languageconstant';
import { AuthService } from '../services/auth/auth.service';
import { SharedService } from '../services/home/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ExternalToasterService } from '../services/external-toaster/external_toaster.service';

@Component({
    selector: 'app-home',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    // test Ramesh
    public breadCrumb;
    public objBreadcrumbs: MenuItem[];
    public username = '';
    public logoutPopup= 'hide';
    public userdetails;
    public homeLocalization = {
        footerLabel: '',
        profileLabel: '',
        logoutLabel: '',
        projectNameLabel: '',
        toggleNavigationLabel: '',
        toggleSearch: ''
    }
    public isClaimLevelOne:any;
    public isClaimLevelTwo:any;
    public isCapaLevelOne:any;
    public isCapaLevelTwo:any;
    public curentPage:string;
    constructor(
        private router: Router,        
        private createnewclaimService: CreatenewclaimService,
        private constant: Constant,
        public urlgeneratorService: UrlgeneratorService,
        public apicallService: ApicallService,
        public externalToasterService: ExternalToasterService,
        private languageconstant: Languageconstant,
        private authService: AuthService,
        private sharedService: SharedService,
        translate: TranslateService
        // private breadcrumbService: BreadcrumbService
    ) {
        console.log('HomeComponent');
        translate.setDefaultLang('en-US');
        translate.use('en-US');
        sharedService.changeEmitted$.subscribe(data => {
            this.curentPage = data.current_page;
        })
        this.objBreadcrumbs = [];
        this.username = this.constant.userAuth.FullName; //1706
        let auth:any = authService.getAccessLevels('CLMCR');
        this.isClaimLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
        this.isClaimLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;

        auth = authService.getAccessLevels('CLMRESCAPA');
        this.isCapaLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
        this.isCapaLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;

        if(!this.isClaimLevelOne && !this.isClaimLevelTwo && !this.isCapaLevelOne && !this.isCapaLevelTwo) {
          this.router.navigate(['/404']);
        }
    }

    ngOnInit() {
        this.getAllDropdownData();
        this.setLanguageConstants();
        this.externalToasterService.getCurrentLanguage();
    }

    setLanguageConstants(): void {
        const lang = this.languageconstant.Language;
        this.homeLocalization = {
            footerLabel: this.languageconstant.home[lang].footerLabel,
            profileLabel: this.languageconstant.home[lang].profileLabel,
            logoutLabel: this.languageconstant.home[lang].logoutLabel,
            projectNameLabel: this.languageconstant.home[lang].projectNameLabel,
            toggleNavigationLabel: this.languageconstant.home[lang].toggleNavigationLabel,
            toggleSearch: this.languageconstant.home[lang].toggleSearch,
        }
    }

    // onLogoutBtnClick(): void {
    //     const link = ['login'];
    //     this.router.navigate(link);
    // }



    gotoPage(_link): void {
        this.router.navigate(_link);
    }

    /*gotoDashboard(): void {
      let link = ['home/dashboard'];
      this.router.navigate(link);
    }

    gotoAdminUsers(): void {
        let link = ['home/adminUsesrs'];
        this.router.navigate(link);
    }

    gotoCustomers(): void {
        let link = ['home/customers'];
        this.router.navigate(link);
    }

    gotoCustomerUsers(): void {
        let link = ['home/customers/customerUsers'];
        this.router.navigate(link);
    }

    onSuccessDoAction(): void {
        //alert("onSuccessDoActionuewyeuweywe");
    }*/
    onLogoutClick(): void {
        this.logoutPopup = 'show';
    }

    onLogoutCancelClick(): void {
        this.logoutPopup = 'hide';
    }

    onLogoutOkClick(): void {
        localStorage.removeItem("userData");
        localStorage.removeItem("responseData");
        localStorage.removeItem("claimData");
        window.location.href = this.constant.loginURL;
    }
    getAllDropdownData(): void {
        // api call
        this.createnewclaimService.getListCreateNewDropDowndata('', response => {
          if(response.ResponseCode==413 || response.ResponseCode==414){
            window.location.href = this.constant.loginURL;
          }else{
            sessionStorage.removeItem("Redirectionlink");
            }
        }, error => {
            
                });
        }
}
