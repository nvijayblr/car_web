import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'

import { Constant } from '../../utill/constants/constant';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../utill/apicall/apicall.service';

@Injectable()
export class LoginService {

    constructor(
      private http: Http,
      private urlgeneratorService: UrlgeneratorService,
      private apicallService: ApicallService
    ) { }


    /**
     * @desc Api call for login user
     * @param {Object} creds user credentials
     * @param {function} successCallback success callback
     * @param {function} failureCallback failure callback
     **/
    loginUserAuth(creds, successCallback, errorCallback) {
      const apiUrl = this.urlgeneratorService.getLoginUserAuthURL(creds);

      this.apicallService.doPostAPIAction(apiUrl, '', response => {
        successCallback(JSON.parse(response._body))
      }, error => {
        errorCallback(error)
      });
    }

    loginUser(creds, successCallback, errorCallback) {
      const apiUrl = this.urlgeneratorService.getLoginUserURL(creds);

      this.apicallService.doPostAPIAction(apiUrl, creds, response => {
        successCallback(JSON.parse(response._body))
      }, error => {
        errorCallback(error)
      });
    }

    getUserAccess(successCallback, errorCallback) {
      const apiUrl = this.urlgeneratorService.getAccessLevelURL();

      this.apicallService.doGetAPIAction(apiUrl, response => {
        successCallback(JSON.parse(response._body))
      }, error => {
        errorCallback(error)
      });
    }

    getAllDomain(successCallback, errorCallback) {
      const apiUrl = this.urlgeneratorService.getAllDomainURL();

      this.apicallService.doGetAPIAction(apiUrl, response => {
        successCallback(JSON.parse(response._body))
      }, error => {
        errorCallback(error)
      });
    }

    getLanguageList(successCallback, errorCallback) {
      const apiUrl = this.urlgeneratorService.getLanguageList();
      this.apicallService.doGetAPIAction(apiUrl, response => {
        successCallback(JSON.parse(response._body))
      }, error => {
        errorCallback(error)
      });
    }

/*    getUserRights(token, successCallback, errorCallback) {
      const apiUrl = this.urlgeneratorService.getLoginUserURL(token);

      this.apicallService.doPostAPIAction(apiUrl, creds, response => {
        successCallback(JSON.parse(response._body))
      }, error => {
        errorCallback(error)
      });
    }
*/
}
