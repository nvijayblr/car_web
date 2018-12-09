import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit,ViewContainerRef } from '@angular/core';
import {FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SharedService } from '../../services/shared/shared.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FileUploader } from 'ng2-file-upload';
import {Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HazardsService } from '../../services/hazard/hazards.service'
import { UrlgeneratorService } from '../../../utill/urlgenerator/urlgenerator.service'
import { TranslateService } from '@ngx-translate/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../../../utill/constants/constant';
import { AccidentService } from '../../services/accident/accident.service';
import $ from 'jquery';

@Component({
  selector: 'app-hazard',
  templateUrl: './hazard.component.html',
  styleUrls: ['./hazard.component.css'],
  providers:[DatePipe,BsModalService]
})
export class HazardComponent implements OnInit, AfterViewInit  {
    @ViewChild('formHazard') formHazard;
    public loading:any;
    public userdetails:any;
    public hazardsNature:any= [{"Id":null,"Name":null}];
    public estimatedPriorityList:any = [];
    public sendToEmailList:any = [];
    public referenceNo:string;
    public attachPhoto: FileUploader;
    public datepickerModel: Date;
    public incidentDateConfig: Partial<BsDatepickerConfig>;
    public carClosedDateConfig: Partial<BsDatepickerConfig>;
    public today;
    public users = [];
    public natureOfInjury:any = [];
    public translationLables:any = {
      error:'',
      genMessage:'',
      warning:'',
      missingFields:'',
      dateOfIncidentToaster:'',
      noChange:'',
      successMsg:'',
      success:'',
    }
    public activeTab = 'block-1';
    public hazardClaim:any;
    public modelConfigConfirm:any;
    public modelConfigPopup:any;
    public modalRef: BsModalRef;
    public resetFormRef: BsModalRef;
    public confg:any;
    public formMode:string;
    public claimStatusList:any = [];
    public validmail = true;
    public apiProcessing :boolean;
    public isSubmited :boolean;
    public deleteAttachmentArray:any = [];
    public formObjectClone:any;
    public IsCapaLevelOne=false;


    constructor(private hazardService:HazardsService,		
              public translate: TranslateService,
              private sharedService: SharedService,
              private urlgeneratorService: UrlgeneratorService,
              private activatedRoute: ActivatedRoute,
              private modalService: BsModalService,
              private toastr: ToastsManager,
              private appConstants:Constant,
              private accidentService: AccidentService,
              private router: Router,
              private vcr: ViewContainerRef) { 
      this.today = new Date();
      this.sharedService.emitChange({current_page: 'ACCIDENT_PAGE'});
      this.incidentDateConfig = Object.assign({}, { maxDate:this.today, showWeekNumbers:false});
      this.carClosedDateConfig = Object.assign({}, {showWeekNumbers:false});
      this.attachPhoto =  new FileUploader({ 
            url: '',
            allowedMimeType: ['image/jpeg', 'image/jpg', 'image/png' ,'image/gif','image/bmp']
            });
      this.toastr.setRootViewContainerRef(vcr);

      activatedRoute.url.subscribe((item) => {
        this.referenceNo = (item[item.length-1])?item[item.length-1].path:'create'
      });
      translate.setDefaultLang('en-US');
      translate.use(localStorage.getItem("lang") ? localStorage.getItem("lang") : 'en-US');
    }

    ngOnInit() {
      this.loading = true;
      this.userdetails = JSON.parse(localStorage.getItem("userData"));
      this.getDropdown();
      this.initializeModel();
      this.translateMessages()
      this.confg = (this.appConstants.toasterConfig)?this.appConstants.toasterConfig:{}
      if(this.referenceNo == 'create'){
        this.formMode = 'CREATE'
      }else{
        this.getClaimDetails(this.referenceNo) 
        this.formMode = 'UPDATE'
      }

      this.attachPhoto.onAfterAddingFile = (item => {
        if(this.attachPhoto.queue.findIndex(x => x.file.name == item.file.name) != this.attachPhoto.queue.length-1 ){
          this.attachPhoto.queue.pop();
        }else if(this.hazardClaim.CorrectiveAction.Attachment.length){
          if( this.hazardClaim.CorrectiveAction.Attachment.findIndex(x => x.FileName == item.file.name) != -1){
            this.attachPhoto.queue.pop();
          }
        }
      })
    }

    ngAfterViewInit(){
      setTimeout(()=>{
        this.onAnchorClick(1, true)
        this.loading = false;
      },500)
    }

    onAnchorClick(_id:any, initLoaded?) {
      let headerNav:any = document.querySelector("#fixed-nav-header");
      let footerNav:any = document.querySelector(".footer-fixed");
      let scrollablePage:any = document.querySelector("#scrollable-page");
      let lastBlock:any = document.querySelector(".block.last");
      let pageHeight:any = $(window).height();
      scrollablePage.style.paddingTop = (headerNav.offsetHeight) + "px";

      let top:any = 0;
      let block:any;
      console.log(pageHeight)
      for (let i=1; i<_id; i++) {
          block = document.querySelector("#block-"+i);
          top = top + block.offsetHeight;
      }
      this.activeTab = "block-"+_id;
      document.body.scrollTop = document.documentElement.scrollTop = top;

      function onScroll(event) {
        var scrollPos = document.documentElement.scrollTop + headerNav.offsetHeight + 10;
        $('#tabHeader a').each(function () {
            var currLink = $(this);
            if(currLink.attr("data-target")) {
              var refElement = $(currLink.attr("data-target"));
              if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('#tabHeader a').removeClass("active");
                currLink.addClass("active");
              } else {
                currLink.removeClass("active");
              }
            }
        });
      }
      if(initLoaded) {
        let footerHeight = footerNav ? footerNav.offsetHeight : 50;
        lastBlock.style.minHeight = (pageHeight - (headerNav.offsetHeight + footerHeight) - 10) + 'px';
        document.removeEventListener('scroll', onScroll);
        document.addEventListener('scroll', onScroll);
      }
    }

    addCustomEmail = (term) => ({Address: term, name: term});

    getDropdown(){
      this.hazardService.getHazardNature(data=>{
        this.hazardsNature = (data)?data:[];
        console.log(JSON.stringify(data));
      },error=>{
        errorToast();
      })

      this.hazardService.getSendToEmail(data=>{
        console.log(data)
        this.sendToEmailList = (data)?data:[];
      },error=>{
        errorToast();
      })

      this.hazardService.getEstimatedPriority(data=>{
        this.estimatedPriorityList = (data)?data:[];
      },error=>{
        errorToast();
      })

      this.hazardService.getInternalClaimStatus(data=>{
        this.claimStatusList = (data)?data:[];
      },error=>{
        errorToast();
      })
      if(this.referenceNo == 'create'){
        this.getMailList();
      }


      function errorToast(){
          this.sharedService.toasterMessage({
            message:this.translationLables.genMessage,
            type:'error',
            title:this.translationLables.error
          })
      }
    }

    getMailList() {
      this.hazardService.getEmailList(data => {
        this.users = (this.users == [] ? ((data) ? data : []) : this.users.concat(data));
      }, error => {
        this.sharedService.toasterMessage({
          message:this.translationLables.genMessage,
          type:'error',
          title:this.translationLables.error
        })
      })
    }


    translateMessages(){
      this.translate.get('hazardDeclarationPage.validation.error').subscribe(value => {
        this.translationLables.error = value;
      });
      this.translate.get('hazardDeclarationPage.validation.genMessage').subscribe(value => {
        this.translationLables.genMessage = value;
      });
      this.translate.get('hazardDeclarationPage.validation.warning').subscribe(value => {
        this.translationLables.warning = value;
      });
      this.translate.get('hazardDeclarationPage.validation.missingFields').subscribe(value => {
        this.translationLables.missingFields = value;
      });
      this.translate.get('hazardDeclarationPage.validation.dateOfIncidentToaster').subscribe(value => {
        this.translationLables.dateOfIncidentToaster = value;
      });
      this.translate.get('hazardDeclarationPage.validation.noChange').subscribe(value => {
        this.translationLables.noChange = value;
      });
      this.translate.get('hazardDeclarationPage.validation.claim').subscribe(value => {
        this.translationLables.claim = value;
      });
      this.translate.get('hazardDeclarationPage.validation.saveSuccess').subscribe(value => {
        this.translationLables.saveSuccess = value;
      });
      this.translate.get('hazardDeclarationPage.validation.updateSuccess').subscribe(value => {
        this.translationLables.updateSuccess = value;
      });
      this.translate.get('hazardDeclarationPage.validation.submitSuccess').subscribe(value => {
        this.translationLables.submitSuccess = value;
      });
      this.translate.get('hazardDeclarationPage.validation.success').subscribe(value => {
        this.translationLables.success = value;
      });
      console.log(this.translationLables,'this.translationLables')
    }

    initializeModel(){

      this.hazardClaim = {
        "InternalClaimTypeId":2,
        "ReferenceNo":null,
        "ObservedDate" : new Date(this.today.getTime()),
        "EmployeeName":null,
        "EmployeeNo":null,
        "EmplyeeMinCo":null,
        "ClaimStatusId":null,
        "HazardDetail":{
            "Location": null,
            "HazardNatureId":null,
            "Description":null,
        },
        "CorrectiveAction":{
          "ActionRequested":null,
          "SendTo":null,
          "EstimatedPriority":null,
          "EmailTo":[],
          "CarClosedBy":this.userdetails.FullName,
          "CarClosedDate":new Date(this.today.getTime()),
          "Attachment":[],
        }

      }
      this.modelConfigConfirm = {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true};
      this.modelConfigPopup = {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true};
    }

    validateemail(email) {
        var testmail = this.hazardClaim.CorrectiveAction.EmailTo.toString();
        var regex=/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4};?)+$/;
        this.validmail = regex.test(testmail);
    }
    
    viewAttachmentList(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.modelConfigPopup);
    }

    confirmResetWindow(template: TemplateRef<any>) {
      this.resetFormRef = this.modalService.show(template, this.modelConfigConfirm);
    }

    resetFormModel(form){
      form.reset()
      this.isSubmited = false;

      if(this.formMode == 'CREATE'){
        setTimeout(()=>{this.initializeModel()},0)
      }else{

        this.getClaimDetails(this.referenceNo)
      }
      this.attachPhoto.queue = [];
      this.resetFormRef.hide();
    }

    getClaimDetails(id){
      var resultSet:any;
      var temp={};
      this.loading = true;
      this.hazardService.getClaimDetails(id, data=>{
            this.hazardClaim = (data)?data:this.hazardClaim;
            setTimeout(() => {

                if(this.hazardClaim.ClaimStatusId == 2 && this.formMode == 'UPDATE'){
                    this.router.navigate(['/internal/claim/hazardview/'+ this.referenceNo]);
                }
            }, 800);
          
             this.hazardClaim.CorrectiveAction.Attachment = (this.formMode == 'CREATE' && this.referenceNo != 'create')?[]:this.hazardClaim.CorrectiveAction.Attachment;        
            this.attachPhoto.queue = [];
            this.deleteAttachmentArray = [];
            this.hazardClaim.ReferenceNo = id;
           
            this.hazardClaim.CorrectiveAction.EmailTo = (this.hazardClaim.CorrectiveAction.EmailTo!=null)?this.hazardClaim.CorrectiveAction.EmailTo.split(','):[];
            for( var i=0; i<this.hazardClaim.CorrectiveAction.EmailTo.length; i++) {
                temp["Address"] = this.hazardClaim.CorrectiveAction.EmailTo[i];
                temp["Id"] = 2;
                temp["Name"] = ''
                this.validateemail(temp["Address"]);
                this.users.push(temp);
            } 
            this.getMailList();
            this.hazardClaim.ObservedDate = new Date(this.hazardClaim.ObservedDate)
            this.hazardClaim.CorrectiveAction.CarClosedDate = new Date(this.hazardClaim.CorrectiveAction.CarClosedDate);
            this.formObjectClone = JSON.stringify(this.hazardClaim);
            this.loading = false;
          }, error=>{
            this.loading = false;
            this.sharedService.toasterMessage({
              message:this.translationLables.genMessage,
              type:'error',
              title:this.translationLables.error
            })
          })
    }

    saveAsDraft(form){
      this.createClaim(1);
    }

    submitClaim(){

      this.isSubmited =true;
      for (var i in this.formHazard.controls) {
        this.formHazard.controls[i].markAsTouched();
      }

      if(this.formHazard.invalid ||
        this.hazardClaim.ObservedDate == ''||
        this.hazardClaim.CorrectiveAction.SendTo =='null'||
        this.hazardClaim.HazardDetail.HazardNatureId =='null'||
        this.hazardClaim.HazardDetail.Location =='null'||
        this.hazardClaim.HazardDetail.Description =='null'||
        (this.hazardClaim.CorrectiveAction.EmailTo.length!==0 && !this.validmail)	){
          this.sharedService.toasterMessage({
            message:this.translationLables.missingFields,
            type:'warning',
            title:this.translationLables.warning
          })
          return;
        }
      this.createClaim(2);
    }

  createClaim(ClaimStatusId){
    if( (JSON.stringify(this.hazardClaim) == this.formObjectClone 
        && this.attachPhoto.queue.length == 0 
        && this.deleteAttachmentArray.length == 0
        && this.formMode =='CREATE') 
        ||
        (JSON.stringify(this.hazardClaim) == this.formObjectClone 
         && this.attachPhoto.queue.length == 0 
         && this.deleteAttachmentArray.length == 0 
         && this.formMode =='UPDATE' 
         && ClaimStatusId == this.hazardClaim.ClaimStatusId)
      ){
           this.sharedService.toasterMessage({message:this.translationLables.noChange,type:'warning',title:this.translationLables.warning})
    } else {
        var params:any
        var toasterMsg:any
        this.loading = true;
        this.apiProcessing = true;
        this.hazardClaim.ClaimStatusId = ClaimStatusId;//draft
        if(this.hazardClaim.ObservedDate) {//prevent JS UTC issue
          this.hazardClaim.ObservedDate = (this.hazardClaim.ObservedDate.toString().split('GMT'))[0]
        }
        params = JSON.parse(JSON.stringify(this.hazardClaim)); 
        params.CorrectiveAction.EmailTo=(params.CorrectiveAction.EmailTo.toString() !="")?params.CorrectiveAction.EmailTo.toString():null;
        params.ReferenceNo = (this.formMode == 'UPDATE')?params.ReferenceNo:''
        this.hazardService.createClaim(params,data=>{
            this.referenceNo = (this.formMode == 'UPDATE')?this.referenceNo:data.Message;
            toasterMsg = (this.isSubmited) ?this.translationLables.claim +' '+this.referenceNo +' '+ this.translationLables.submitSuccess
                    :this.translationLables.claim +' '+ this.referenceNo +' '+ this.translationLables.saveSuccess;
             this.sharedService.toasterMessage({
                  message:toasterMsg,
                  type:'success',
                  title:this.translationLables.success
              });
            if(this.attachPhoto.queue.length){
                let attachmentURL = this.urlgeneratorService.uploadHazardFile(this.referenceNo);
                for(let inx in this.attachPhoto.queue) {
                     this.attachPhoto.queue[inx].url = attachmentURL;
                }
                this.attachPhoto.uploadAll();
                this.attachPhoto.onCompleteAll = () => { deleteAttachment(this) }
            } 
            else {
                 deleteAttachment(this);
            }
          },error=>{
            deleteAttachment(this);
            this.sharedService.toasterMessage({
              message:this.translationLables.genMessage,
              type:'error',
              title:this.translationLables.error
            })
          })
        this.hazardClaim.ClaimStatusId = 0;
     }

      function deleteAttachment(self:any){
        self.attachPhoto.queue = [];
        if(self.deleteAttachmentArray.length){
        self.hazardService.deleteAttachment({
          "AttachmentID":self.deleteAttachmentArray
          },data=>{
              methodDefaults(self)
          },error=>{
              methodDefaults(self)
        })
      }else{
        methodDefaults(self)
      }
    }

    function methodDefaults(self:any){
      if(self.referenceNo) {
        self.getClaimDetails(self.referenceNo)
      }
      self.isSubmited = false;
      self.apiProcessing = false;
      self.loading = false;
      }
  } 

  deleteAttachment(id, del){
    this.hazardClaim.CorrectiveAction.Attachment.splice(del,1)
    this.deleteAttachmentArray.push(id);
  }

}
