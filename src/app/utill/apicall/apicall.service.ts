import { Injectable, ViewContainerRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions, RequestMethod, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../constants/constant';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Router } from '@angular/router';

@Injectable()
export class ApicallService {
    public apiHeaderToken;
    constructor(
        public http: Http,
        private toastr: ToastsManager,
        private constant: Constant,
        protected storage: AsyncLocalStorage,
        private router: Router
    ) {}

    /**
     * @desc Http service call for GET method
     * @param {string} apiUrl api url
     * @param {function} successCallback success callback
     * @param {function} failureCallback failure callback
     **/
    doGetAPIAction(apiUrl, successCallback, failureCallback) {
      let header:any = {
        'Authorization': 'Bearer ' + this.constant.loginAPIHeader.Authorization,
        'Content-Type': 'application/json',
        'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
        'Cache-control': 'no-cache',
        'Pragma': 'no-cache'
      };
      
      this.http
          .get(apiUrl,  {
              headers : header
          })
          .subscribe(response => {
              successCallback(response);
          }, error => {
              if(error && error.status == 401 && error.statusText == 'Unauthorized') {
                  this.toastr.error('Unauthorized access.', 'Failure!', {
                    showCloseButton: true, maxShown: 1
                  });
                  setTimeout(()=>{
                    this.router.navigate(['/login']);
                  }, 2000)
                  return;
              }
              this.onErrorToastMessage(error);
              failureCallback(error);
          });
    }

    doGetPdfAPI(apiUrl, successCallback, failureCallback) {
      let header:any = {
        'Authorization': 'Bearer ' + this.constant.loginAPIHeader.Authorization,
        'Content-Type': 'application/json',
        'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
        'Cache-control': 'no-cache',
        'Pragma': 'no-cache'
      };
      this.http.get(apiUrl, {headers: header, responseType: ResponseContentType.Blob}).map((res) => {
          return new Blob([res.blob()], { type: 'application/pdf' });
      }).subscribe(response => {
          successCallback(response);
      }, error => {
          if(error && error.status == 401 && error.statusText == 'Unauthorized') {
              this.toastr.error('Unauthorized access.', 'Failure!', {
                showCloseButton: true, maxShown: 1
              });
              setTimeout(()=>{
                this.router.navigate(['/login']);
              }, 2000)
              return;
          }
          this.onErrorToastMessage(error);
          failureCallback(error);
      });
    }


    /**
     * @desc Http service call for POST method
     * @param {string} apiUrl api url
     * @param {Object} data the data to be posted to the api
     * @param {function} successCallback success callback
     * @param {function} failureCallback failure callback
     **/
    doPostAPIAction(apiUrl, data, successCallback, failureCallback) {
        let header:any = {
          'Authorization': 'Bearer ' + this.constant.loginAPIHeader.Authorization,
          'Content-Type': 'application/json',
          'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
          'Cache-control': 'no-cache',
          'Pragma': 'no-cache'
        };
        this.http
          .post(apiUrl, data, {
              headers : header
          })
          .subscribe(response => {
              successCallback(response);
          }, error => {
              if(error && error.status == 401 && error.statusText == 'Unauthorized') {
                this.toastr.error('Unauthorized access.', 'Failure!', {
                  showCloseButton: true, maxShown: 1
                });
                setTimeout(()=>{
                  this.router.navigate(['/login']);
                }, 2000)
                return;
              }
              this.onErrorToastMessage(error);
              failureCallback(error);
          });
    }

    doDeleteAPIAction(apiUrl, successCallback, failureCallback) {
      let header:any = {
        'Authorization': 'Bearer ' + this.constant.loginAPIHeader.Authorization,
        'Content-Type': 'application/json',
        'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
        'Cache-control': 'no-cache',
        'Pragma': 'no-cache'
      };
      
      this.http
          .delete(apiUrl,  {
              headers : header
          })
          .subscribe(response => {
              successCallback(response);
          }, error => {
              if(error && error.status == 401 && error.statusText == 'Unauthorized') {
                  this.toastr.error('Unauthorized access.', 'Failure!', {
                    showCloseButton: true, maxShown: 1
                  });
                  setTimeout(()=>{
                    this.router.navigate(['/login']);
                  }, 2000)
                  return;
              }
              this.onErrorToastMessage(error);
              failureCallback(error);
          });
    }

    /**
     * @desc show error toast messages
     * @param {Object} error response object
     **/
    onErrorToastMessage(error): void {
      this.toastr.error('No network found.Please check your internet connection.', 'Failure!', {
        showCloseButton: true, maxShown: 1
      });
    }
}
