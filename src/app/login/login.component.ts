import { Component, OnInit, ViewEncapsulation, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { Languageconstant } from '../utill/constants/languageconstant';
import { Constant } from '../utill/constants/constant';
import { AsyncLocalStorage } from 'angular-async-local-storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './login.component.scss'],
})
export class LoginComponent implements OnInit {
    public loading = true;
    public creds = {
      username: '',
      password: '',
      LanguageCulture: '',
      domainID: null
    };
    public rememberme:boolean = false;
    public domainData = [];
    public languageList = [];

    ngOnInit(){
      localStorage.removeItem("userData");
      localStorage.removeItem("responseData");
      localStorage.removeItem("claimData");
      localStorage.removeItem("AuthToken");
    }
    constructor(
      private router: Router,
      private toastr: ToastsManager,
      private vcr: ViewContainerRef,
      public constant: Constant,
      public loginService:LoginService
    ){
      this.toastr.setRootViewContainerRef(vcr);
      this.loading = true;
      this.getAllDomain();
      this.getLanguageList();
      let localLang = localStorage.getItem('lang')
      this.creds.LanguageCulture = (localLang)?localLang:"en-US";
    }

    getAllDomain() {
      this.loginService.getAllDomain(response => {
        if(!response || !response.Data) {
          this.toastr.error('Please try after sometime', 'Warning!', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.router.navigate(['/login']);
          return;
        }
        this.domainData = response.Data;
        let storedUser:any = JSON.parse(localStorage.getItem('arcuser'));
        if(storedUser && storedUser.username && storedUser.domainID) {
          this.creds.domainID = storedUser.domainID;
          this.creds.username = storedUser.username;
          this.rememberme = storedUser.rememberme;
        }
        this.loading = false;
      }, error=>{
          this.toastr.error('Please try after sometime', 'Warning!', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.loading = false;
      });
    }
    getLanguageList() {
      this.loginService.getLanguageList(response => {
        this.languageList = response;
        this.loading = false;
      }, error=>{
          this.toastr.error('Please try after sometime', 'Warning!', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.loading = false;
      });
    }

    gotoLandingPage(formData) {
      if(!formData.username && !formData.password && !formData.domainID) {
        this.toastr.error('Please type valid username and password', 'Warning!', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
        return;
      }

      if(!formData.username) {
        this.toastr.error('Please enter valid username', 'Warning!', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
        return;
      }

      if(!formData.password) {
        this.toastr.error('Please enter valid password', 'Warning!', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
        return;
      }

      if(!formData.domainID) {
        this.toastr.error('Please Choose domain name', 'Warning!', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
        return;
      }
      this.loading = true;
      this.loginService.loginUser(formData, response => {
        let status = response.ResponseCode;
        let data = JSON.parse(response.Data);
        /*Invalid username or password*/
        if(status == 404) {
          this.toastr.error('Invalid username/password.', 'Warning!', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.loading = false;
          return;
        }
        if(data && status == 200) {
          if(this.rememberme) {
            delete formData.password;
            formData.rememberme = this.rememberme;
            localStorage.setItem("arcuser", JSON.stringify(formData));
          } else {
            localStorage.removeItem("arcuser");
          }
          localStorage.setItem("AuthToken", JSON.stringify(data));
          localStorage.setItem("lang", this.creds.LanguageCulture);
          this.constant.loginAPIHeader.Authorization = data.access_token;

          /*Get the user access level*/
          this.loginService.getUserAccess(response => {
            if(response.ResponseCode !=200  || !response.Data) {
              this.loading = false;
              this.toastr.error(response.ResponseMessage, 'Warning!', {
                showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
              });
              this.router.navigate(['/login']);
              return;
            }
            localStorage.setItem("userData", JSON.stringify(response.Data));
            this.constant.userAuth = response.Data;
            this.loading = false;
            /*If found the redirection link, goto respective page*/
            if(sessionStorage.getItem("Redirectionlink")) {
              this.router.navigate([sessionStorage.getItem("Redirectionlink")]);
              return;
            }
            this.router.navigate(['/landing']);
          }, error=>{
              this.toastr.error('Please try after sometime', 'Warning!', {
                showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
              });
              this.loading = false;
          });
        }
      }, error=>{
        this.toastr.error('Please try after sometime', 'Warning!', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
        this.loading = false;
      });
   }
}
