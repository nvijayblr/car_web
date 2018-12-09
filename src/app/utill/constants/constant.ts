import { Injectable } from '@angular/core';

Injectable()
export class Constant {
    public devURL;
    public env;
    public envTitle;
    public baseURL;
    public loginURL;
    public loginUser;
    public selectedProjectId;
    public editMode;
    public complaintNum;
    public toastTime;
    public claimtype;
    public loginAPIHeader;
    public apiHeader;
    public searchObject;
    public searchCapaObject;
    public userAuth:any;
    public authState:object;
    public accessLevels;
    public softVersion:any;
    public toasterConfig:object;

    constructor(){
        this.env = 'Dev'
        this.softVersion = 'v2.4.0'
        this.envTitle =''
        switch (this.env) {
            case "Dev":
                this.baseURL = 'http://192.168.2.46:6003/';
                this.loginURL =  'http://192.168.2.46:6002';
                this.envTitle ='Development Environment'
                break;
            case "QA":
                this.baseURL  = 'http://192.168.2.46:7001/';
                this.loginURL = 'http://192.168.2.46:7000';
                this.envTitle = 'Development Environment(QA)'
                break;
            case "Stag":
                this.baseURL  = 'https://cardev.amer.dmai.net/'; //ARC CAR STAGING api
                this.loginURL = 'https://cardev.amer.dmai.net/'; // Login integrated STAGING
                this.envTitle ='Development Environment'
                break;
            case "Prod":
                this.baseURL  = 'https://car.amer.dmai.net/';
                this.loginURL = 'https://car.amer.dmai.net/';
                this.envTitle = 'Production Environment'
                break;

            case "Mob":
                this.baseURL  = 'http://testclaims.arc-intl.com:8080/';
                this.loginURL = 'http://27.251.163.154:8080';
                this.envTitle = 'Development Environment'
                break;

            default:
                this.devURL = '';
                this.baseURL = 'http://192.168.2.46:8175/';      //ARC CAR DEV Api
                this.loginURL =  'http://192.168.2.46:6000';     //Login integrated DEV
                this.envTitle ='Development Environment'
                break;
        }
        // config toaster in internal claim
        this.toasterConfig = {
            positionClass:'toast-top-right',
            showCloseButton: true,
            maxShown: 1,
            toastLife: 5000
        }
        this.accessLevels = {
            levelOne:30,
            levelTwo:20,
            isLevelOne: false,
            isLevelTwo: false
        }
        this.loginUser = { email: '' };
        this.userAuth = {};
        this.authState = {};
        this.selectedProjectId = 0;
        this.editMode = 'false';
        this.complaintNum =  '';
        this.toastTime = 10000;
        this.claimtype = 0;
        let token = null;
        if(localStorage.getItem('AuthToken')) {
            token = JSON.parse(localStorage.getItem('AuthToken')).access_token;
        }
        this.loginAPIHeader = {
            'Authorization': token ? token : 'YWNjb3VudGluZ0Jhc2VTeXN0ZW06c2VjcmV0',
            'Accept': 'application/json'
        };
        this.apiHeader = {
            'Authorization': '',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        this.searchObject = {
            'custName': '',
            'claimInitatorFromdate': '',
            'claimInitatorTodate': '',
            'claimTypeSelectedValue': '0',
            'CARNo': '',
            'invoiceNum': '',
            'claimStatusSelectedValue': '0',
            'claimCategorySelectedValue': '0',
            'convetedFromdate': '',
            'convetedTodate': '',
            'searchSatus' : false,
            'CreatedBy': '',
            'Role': '',
            'GlobalSerach':''
        };

        this.searchCapaObject = {
            'SearchString': '',
            'CapaInitiatedFrm': '',
            'CapaInitiatedTo': '',
            'CAPAFor': '0',
            'CAPANumber': '',
            'Status': '0',
            'CustomerName': '',
            'searchSatus' : false,
            'DefectCode': '',
            'convetedFromdate':'',
            'convetedTodate':''
        }
    }
}
