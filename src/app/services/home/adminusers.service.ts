import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'

import { Constant } from '../../utill/constants/constant';
import { UrlgeneratorService } from '../../utill/urlgenerator/urlgenerator.service';
import { ApicallService } from '../../utill/apicall/apicall.service';

@Injectable()
export class AdminusersService {
    public adminUserRequestBody = {};
    constructor(
        private http: Http,
        private urlgeneratorService: UrlgeneratorService,
        private apicallService: ApicallService
    ) { }

    createAdminUser(adminUserDetails, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getCreateAdminUserURL();
        if (adminUserDetails.adminUserStatus === '') {
            adminUserDetails.adminUserStatus = false;
        }
        this.adminUserRequestBody = {
            'name': adminUserDetails.adminUserName,
            'password': adminUserDetails.adminUserNewPassword,
            'username': adminUserDetails.adminUserEmail,
            'adminRole': {
                'id': 1,
                'name': 'Admin'
            },
            'userType': {
                'id': 1,
                'name': 'Admin'
            },
            'isActive': adminUserDetails.adminUserStatus
        }
        this.apicallService.doPostAPIAction(apiUrl, this.adminUserRequestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    getListAdminUser(adminUserDetails, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getListAdminUserURL();
        this.apicallService.doGetAPIAction(apiUrl,  response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    updateAdminUser(adminUserDetails, selectedUserId, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getUpdateAdminUserURL();
        if (adminUserDetails.adminUserStatus === '') {
            adminUserDetails.adminUserStatus = false;
        }
        this.adminUserRequestBody = {
            'id': selectedUserId,
            'name': adminUserDetails.adminUserName,
            'password': adminUserDetails.adminUserNewPassword,
            'username': adminUserDetails.adminUserEmail,
            'adminRole': {
                'id': 1,
                'name': 'Admin'
            },
            'userType': {
                'id': 1,
                'name': 'Admin'
            },
            'isActive': adminUserDetails.adminUserStatus
        }

        this.apicallService.doPostAPIAction(apiUrl, this.adminUserRequestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }

    deleteAdminUser(selectedUser, successCallback, errorCallback) {
        const apiUrl = this.urlgeneratorService.getDeleteAdminUserURL();
        this.adminUserRequestBody = {
            'id': selectedUser.id
        }

        this.apicallService.doPostAPIAction(apiUrl, this.adminUserRequestBody, response => {
            successCallback(JSON.parse(response._body))
        }, error => {
            errorCallback(error)
        });
    }
}
