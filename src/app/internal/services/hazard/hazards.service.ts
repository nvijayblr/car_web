import { Injectable } from '@angular/core';
import { UrlgeneratorService } from '../../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../../utill/apicall/apicall.service';

@Injectable()
export class HazardsService {

  constructor(		public urlgeneratorService: UrlgeneratorService,
    private apicallService: ApicallService) { }

  	getHazardNature(successCallback, errorCallback) {
      const apiUrl = this.urlgeneratorService.getHazardNature();
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

    getEstimatedPriority(successCallback, errorCallback) {
      const apiUrl = this.urlgeneratorService.getEstimatedPriority();
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

    getEmailList(successCallback, errorCallback) {
      const apiUrl = this.urlgeneratorService.getEmailList();
      this.apicallService.doGetAPIAction(apiUrl, response => {
          successCallback(JSON.parse(response._body))
      }, error => {
          errorCallback(error)
      });
    }

    getClaimDetails(id,successCallback, errorCallback) {
      const apiUrl = this.urlgeneratorService.getHazardClaim(id);
      this.apicallService.doGetAPIAction(apiUrl, response => {
          successCallback(JSON.parse(response._body))
      }, error => {
          errorCallback(error)
      });
    }

    createClaim(args,successCallback, errorCallback) {
      var apiUrl:string 
      if(args.ReferenceNo){
        apiUrl = this.urlgeneratorService.hazardClaimUpdate();
      }else{
          apiUrl = this.urlgeneratorService.hazardClaimCreate();
      }
      this.apicallService.doPostAPIAction(apiUrl,args, response => {
          successCallback(JSON.parse(response._body))
      }, error => {
          errorCallback(error)
      });
    }
    deleteAttachment(args,successCallback, errorCallback) {
  		var apiUrl:string 
  			apiUrl = this.urlgeneratorService.deleteHazardAttachment();
        this.apicallService.doPostAPIAction(apiUrl,args, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
}
