import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'

import { Constant } from '../../utill/constants/constant';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../utill/apicall/apicall.service';

@Injectable()
export class CapaService {

	constructor(
		private http: Http,
        private urlgeneratorService: UrlgeneratorService,
        private apicallService: ApicallService
		) { }
	
     searchCapa(searchCapaObject, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getSearchCAPA();
        searchCapaObject = {
            'SearchString': searchCapaObject.SearchString,
            'CapaInitiatedFrm': searchCapaObject.CapaInitiatedFrm,
            'CapaInitiatedTo': searchCapaObject.CapaInitiatedTo,
            'CAPAFor': searchCapaObject.CAPAFor,
            'CAPANumber': searchCapaObject.CAPANumber,
            'Status': searchCapaObject.Status,
            'CustomerName': searchCapaObject.CustomerName,
            'DefectCode':searchCapaObject.DefectCode,
            'PageSize': searchCapaObject.PageSize,
            'PageNum': searchCapaObject.PageNum,
            'SortingColumn': searchCapaObject.SortingColumn, 
            'SortingOrder': searchCapaObject.SortingOrder
        }
        this.apicallService.doPostAPIAction(apiUrl, searchCapaObject, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    } 

     getCapaForMinorClaimList(successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getCapaForMinorClaimListURL();
        this.apicallService.doGetAPIAction(apiUrl, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

}
