import { Injectable } from '@angular/core';
import { UrlgeneratorService } from '../../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../../utill/apicall/apicall.service';

@Injectable()
export class InternalService {
    public curentPage:string;
    constructor(
        public urlgeneratorService: UrlgeneratorService,
        private apicallService: ApicallService,
    ) {
     }

    getClaimType(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getClaimTypeListURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body));
        }, error => {
            errorCallback(error)
        });
    }

    getClaimStatus(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getClaimStatusListURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body));
        }, error => {
            errorCallback(error)
        });
    }

    searchClaim(searchFilter, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getInternalSearchClaimURL();
        this.apicallService.doPostAPIAction(apiUrl, searchFilter, response => {
            successCallback(JSON.parse(response._body));
        }, error => {
            errorCallback(error)
        });
    }

    getClaimDetails(_claimId,_referenceNo, successCallback, errorCallback) {
        var apiUrl:string 
        if(_claimId==1) {
            apiUrl = this.urlgeneratorService.getInternalAccidentClaimPrintPreviewURL();
        } else{
             apiUrl = this.urlgeneratorService.getInternalHazardClaimPrintPreviewURL();
        }
        this.apicallService.doGetAPIAction(apiUrl + '?ReferenceNo=' + _referenceNo, response => {
            successCallback(JSON.parse(response._body));
        }, error => {
            errorCallback(error)
        });
    }

    getClaimPDF(_claimId,_referenceNo, successCallback, errorCallback) {
        var apiUrl:string 
        if(_claimId==1) {
            apiUrl = this.urlgeneratorService.getInternalClaimPDFURL(_referenceNo);
        } else{
             apiUrl = this.urlgeneratorService.getHazardClaimPDFURL(_referenceNo);
        }

        this.apicallService.doGetPdfAPI(apiUrl , response => {
            successCallback(response)
        }, error => {
            errorCallback(error)
        });
    }

    deleteInternalClaim(_referenceNo, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.deleteInternalClaimURL();
        this.apicallService.doDeleteAPIAction(apiUrl + '/' + _referenceNo, response => {
            successCallback(response)
        }, error => {
            errorCallback(error)
        });
    }

}
