import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'

import { Constant } from '../../utill/constants/constant';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../utill/apicall/apicall.service';
import { AsyncLocalStorage } from 'angular-async-local-storage';

@Injectable()
export class DashboardService {

    public userEmail;
    public searchObject;
    constructor(
        private http: Http,
        public urlgeneratorService: UrlgeneratorService,
        private apicallService: ApicallService,
        protected storage: AsyncLocalStorage,
    ) { }

    /**
     * @desc Api call for login user
     * @param {Object} creds user credentials
     * @param {function} successCallback success callback
     * @param {function} failureCallback failure callback
     **/
    getDashboardDetails(creds, successCallback, errorCallback) {

        this.storage.getItem('loginUser').subscribe((data) => {
            this.userEmail = data.username;
        }, () => { });

        setTimeout(() => {
            const apiUrl = this.urlgeneratorService.getDashboardDetailsURL(this.userEmail);
            console.log(apiUrl);
            this.apicallService.doGetAPIAction(apiUrl, response => {
                successCallback(JSON.parse(response._body))
            }, error => {
                errorCallback(error)
            });
        }, 1000);
    }

    searchClaim(createNewClaimObjects, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExternalSearchClaimURL();
        this.searchObject = {
            'CustomerName': createNewClaimObjects.custName,
            'ClaimInitiationFrom': createNewClaimObjects.claimInitatorFromdate,
            'ClaimInitiationTo': createNewClaimObjects.claimInitatorTodate,
            'ClaimTypeId': createNewClaimObjects.claimTypeSelectedValue,
            'ComplaintNumber': createNewClaimObjects.CARNo,
            'InvoiceNumber': createNewClaimObjects.invoiceNum,
            'CategoryID': createNewClaimObjects.claimCategorySelectedValue,
            'StatusID': createNewClaimObjects.claimStatusSelectedValue,
            'NoOfDays': '',
            'CreatedBy': createNewClaimObjects.CreatedBy,
            'Role': createNewClaimObjects.Role,
            'GlobalSerach':createNewClaimObjects.GlobalSerach,
            'PageSize': createNewClaimObjects.PageSize,
            'PageNum': createNewClaimObjects.PageNum,
            'SortingColumn': createNewClaimObjects.SortingColumn, 
            'SortingOrder': createNewClaimObjects.SortingOrder,
            'Initiator': createNewClaimObjects.Initiator
        }
        this.apicallService.doPostAPIAction(apiUrl, this.searchObject, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
     createCapa(value, successCallback, errorCallback){
         const apiUrl = this.urlgeneratorService.getcreateCapaURL();
          this.apicallService.doPostAPIAction(apiUrl, value, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
         /* const apiUrl = this.urlgeneratorService.getcreateCapaURL(value);
          this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });*/
      }

    getClaimPDF(_compliantNumber, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getExternalClaimPDFURL();
        this.apicallService.doGetPdfAPI(apiUrl + '?CompliantNumber=' + _compliantNumber, response => {
            successCallback(response)
        }, error => {
            errorCallback(error)
        });
    }

    deleteExternalClaim(_compliantNumber, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.deleteExternalClaimURL();
        this.apicallService.doDeleteAPIAction(apiUrl + '/' + _compliantNumber, response => {
            successCallback(response)
        }, error => {
            errorCallback(error)
        });
    }
}
