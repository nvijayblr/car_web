import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Constant } from './../../utill/constants/constant';



@Injectable()
export class ExternalToasterService {

    private toasterMessagesList: any;

    constructor(private http: Http, private constant : Constant
    ) {
        // this.getCurrentLanguage();      
    }

    getCurrentLanguage(){
        this.toasterMessagesList = [];
        var currentLanguage : String;
        if(localStorage.getItem('lang'))
        currentLanguage = localStorage.getItem('lang');
        this.getLanguageToasters(currentLanguage);
    }

    getLanguageToasters(logged_lang){
        //  this.toasterMessagesList = [];
        if(logged_lang == "en-US")
        this.http.get('../../../assets/toaster_messages/external_toasters/en_US_toasters.json').subscribe(res => {
            this.toasterMessagesList = res.json();
        });
        else if(logged_lang == "fr-FR"){
            this.http.get('../../../assets/toaster_messages/external_toasters/fr_FR_toasters.json').subscribe(res => {
                this.toasterMessagesList = res.json();
            });  
        }
        else if(logged_lang == "ru-RU"){
            this.http.get('../../../assets/toaster_messages/external_toasters/ru_RU_toasters.json').subscribe(res => {
                this.toasterMessagesList = res.json();
            });  
        }
        else if(logged_lang == "zh-CN"){
            this.http.get('../../../assets/toaster_messages/external_toasters/zh_CN_toasters.json').subscribe(res => {
                this.toasterMessagesList = res.json();
            });  
        }
    }

    getClaimSaveEditSuccess(messageCode, claim_no) {  
        var message: String; 
        if(this.toasterMessagesList)
        message = this.toasterMessagesList[messageCode] ? this.toasterMessagesList[messageCode] : "";     
        message = message.replace('{claim_no}',claim_no);      
        
        return message;
    }
    getMessageFromCode(messageCode){
        if(this.toasterMessagesList)
        return this.toasterMessagesList[messageCode] ? this.toasterMessagesList[messageCode] : "";
    }
    
}