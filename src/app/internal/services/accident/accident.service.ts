import { Injectable } from '@angular/core';
import { UrlgeneratorService } from '../../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../../utill/apicall/apicall.service';

@Injectable()
export class AccidentService {

  	constructor(
		public urlgeneratorService: UrlgeneratorService,
    	private apicallService: ApicallService
  	) { }

  	getTypeofEmployment(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getTypeofEmployment();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

  	getInjuryLocation(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getInjuryLocation();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

  	getInjuryNature(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getInjuryNature();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

  	getSendToEmail(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getSendToEmail();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

  	getInternalClaimStatus(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getInternalClaimStatus();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    createClaim(args,successCallback, errorCallback) {
      var apiUrl:string 
      if(args.ReferenceNo){
        apiUrl = this.urlgeneratorService.accidentClaimUpdate();
      }else{
          apiUrl = this.urlgeneratorService.accidentClaimCreate();
      }
        this.apicallService.doPostAPIAction(apiUrl,args, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
  	deleteAttachment(args,successCallback, errorCallback) {
  		var apiUrl:string 
  			apiUrl = this.urlgeneratorService.deleteAccidentAttachment();
        this.apicallService.doPostAPIAction(apiUrl,args, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

  	getClaimDetails(id,successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.accidentClaimGet(id);
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    getEmailList(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getEmailList();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
}
