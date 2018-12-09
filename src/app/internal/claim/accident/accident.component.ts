import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit,ViewContainerRef } from '@angular/core';
import {FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SharedService } from '../../services/shared/shared.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FileUploader } from 'ng2-file-upload';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AccidentService } from '../../services/accident/accident.service'
import { UrlgeneratorService } from '../../../utill/urlgenerator/urlgenerator.service'
import { TranslateService } from '@ngx-translate/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constant } from '../../../utill/constants/constant'
import $ from 'jquery';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}    from '@angular/router';

@Component({
  selector: 'app-accident',
  templateUrl: './accident.component.html',
  styleUrls: ['./accident.component.css'],
  providers:[DatePipe,BsModalService]
})
export class AccidentComponent implements OnInit, AfterViewInit {

	@ViewChild('formAC') formAC;
	public modalRef: BsModalRef;
	public resetFormRef: BsModalRef;
	public userdetails:any;
	public timeValid:any;
	public deleteAttachmentArray:any = [];
	public formObjectClone:any;
	public referenceNo:string;
	public formMode:string;
	public attachPhoto: FileUploader;
	public datepickerModel: Date;
	public incidentDateConfig: Partial<BsDatepickerConfig>;
	public carClosedDateConfig: Partial<BsDatepickerConfig>;
	public today;
	public validIncidentTime = true;
	public validmail = true;
	public typeOfEmployment:any = [];
	public natureOfInjury:any = [];
	public locationOfInjury:any = [];
	public claimStatusList:any = [];
	public sendToEmailList:any = [];
	public accidentClaim:any;
	public loading:any;
	public bindTimePicker:boolean;
	public confg:any;
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
	public isSubmited :boolean;
	public apiProcessing :boolean;
	public users = []
	public activeTab = 'block-1';
  	public modelConfigConfirm:any;
  	public modelConfigPopup:any;

	constructor(
		public translate: TranslateService,
		private sharedService: SharedService,
		private urlgeneratorService: UrlgeneratorService,
		private accidentService: AccidentService,
		private activatedRoute: ActivatedRoute,
		private modalService: BsModalService,
	 	private toastr: ToastsManager,
        private appConstants:Constant,
        private router: Router,
     	private vcr: ViewContainerRef
		) {
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
		// attachment duplicate removed
		this.attachPhoto.onAfterAddingFile = (item => {
			if(this.attachPhoto.queue.findIndex(x => x.file.name == item.file.name) != this.attachPhoto.queue.length-1 ){
				this.attachPhoto.queue.pop();
			}else if(this.accidentClaim.InjuryDetail.Attachment.length){
				if( this.accidentClaim.InjuryDetail.Attachment.findIndex(x => x.FileName == item.file.name) != -1){
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

	translateMessages(){
		this.translate.get('accidentDeclarationPage.validation.error').subscribe(value => {
			this.translationLables.error = value;
		});
		this.translate.get('accidentDeclarationPage.validation.genMessage').subscribe(value => {
			this.translationLables.genMessage = value;
		});
		this.translate.get('accidentDeclarationPage.validation.warning').subscribe(value => {
			this.translationLables.warning = value;
		});
		this.translate.get('accidentDeclarationPage.validation.missingFields').subscribe(value => {
			this.translationLables.missingFields = value;
		});
		this.translate.get('accidentDeclarationPage.validation.dateOfIncidentToaster').subscribe(value => {
			this.translationLables.dateOfIncidentToaster = value;
		});
		this.translate.get('accidentDeclarationPage.validation.noChange').subscribe(value => {
			this.translationLables.noChange = value;
		});
		this.translate.get('accidentDeclarationPage.validation.claim').subscribe(value => {
			this.translationLables.claim = value;
		});
		this.translate.get('accidentDeclarationPage.validation.saveSuccess').subscribe(value => {
			this.translationLables.saveSuccess = value;
		});
		this.translate.get('accidentDeclarationPage.validation.updateSuccess').subscribe(value => {
			this.translationLables.updateSuccess = value;
		});
		this.translate.get('accidentDeclarationPage.validation.submitSuccess').subscribe(value => {
			this.translationLables.submitSuccess = value;
		});
		this.translate.get('accidentDeclarationPage.validation.success').subscribe(value => {
			this.translationLables.success = value;
		});
		console.log(this.translationLables,'this.translationLables')
	}

    addCustomEmail = (term) => ({Address: term, name: term});

 	initializeModel(){
 		this.bindTimePicker = true;
		this.accidentClaim = {
			"InternalClaimTypeId":1,
			"ReferenceNo":null,
			"EmployeeNo":null,
			"EmployeeName":null,
			"EmplyeeMinCo":null,
			"EmploymentTypeId":null,
			"IncidentDate" : new Date(this.today.getTime()),
			"IncidentTime":null,
			"ClaimStatusId":null,
			"InjuryDetail":{
				"InjuryNatureId":null,
				"InjuryLocationId":null,
				"Ppe":null,
				"CarClosedBy":this.userdetails.FullName,
				"CarClosedDate":new Date(this.today.getTime()),
				"Attachment":[]
			},
			"IncidentDetail":{
				"SendToId":null,
				"ReportedBy":null,
				"Location":null,
				"Description":null,
				"ImmediateAction":null,
				"EmailTo":[]
			}
		}
    this.modelConfigConfirm = {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true};
    this.modelConfigPopup = {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true};
 	}

	viewAttachmentList(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, this.modelConfigPopup);
	}

 	getDropdown(){
 		this.accidentService.getTypeofEmployment(data=>{
 			this.typeOfEmployment = (data)?data:[]
 		},error=>{
 			errorToast();
 		})

 		this.accidentService.getInjuryLocation(data=>{
 			this.locationOfInjury = (data)?data:[];
 		},error=>{
 			errorToast();
 		})

 		this.accidentService.getInjuryNature(data=>{
 			this.natureOfInjury = (data)?data:[];
 		},error=>{
 			errorToast();
 		})

 		this.accidentService.getSendToEmail(data=>{
 			console.log(data)
 			this.sendToEmailList = (data)?data:[];
 		},error=>{
 			errorToast();
 		})

 		this.accidentService.getInternalClaimStatus(data=>{
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
		this.accidentService.getEmailList(data => {
			this.users = (this.users == [] ? ((data) ? data : []) : this.users.concat(data));
		}, error => {
			this.sharedService.toasterMessage({
				message:this.translationLables.genMessage,
				type:'error',
				title:this.translationLables.error
			})
		})
	}

 	getClaimDetails(id){
 		var resultSet:any;
 		var tempObject:any = [];
 		var temp={};
 		this.loading = true;
 		this.accidentService.getClaimDetails(id, data=>{
			 this.accidentClaim = (data)?data:this.accidentClaim;
			 setTimeout(() => {
				if(this.accidentClaim.ClaimStatusId == 2 && this.formMode == 'UPDATE'){
 				this.router.navigate(['/internal/claim/view/accident/'+ this.referenceNo]);
 				}
			 }, 800);
 			this.accidentClaim.InjuryDetail.Attachment = (this.formMode == 'CREATE' && this.referenceNo != 'create')?[]:this.accidentClaim.InjuryDetail.Attachment;
			this.attachPhoto.queue = [];
			this.deleteAttachmentArray = [];
 			this.accidentClaim.ReferenceNo = id;
 			this.accidentClaim.IncidentDetail.EmailTo = (this.accidentClaim.IncidentDetail.EmailTo)?this.accidentClaim.IncidentDetail.EmailTo.split(','):[];
		 	for(var i=0;i<this.accidentClaim.IncidentDetail.EmailTo.length;i++){
				temp["Address"] = this.accidentClaim.IncidentDetail.EmailTo[i];
				temp["Id"] = 2;
				temp["Name"] = ''
				this.validateemail(temp["Address"]);
				this.users.push(temp);
			 }
			 this.getMailList();
 			this.accidentClaim.IncidentDate = new Date(this.accidentClaim.IncidentDate)
 			this.accidentClaim.InjuryDetail.CarClosedDate = new Date(this.accidentClaim.InjuryDetail.CarClosedDate);
 			tempObject = (this.accidentClaim.IncidentTime)?this.accidentClaim.IncidentTime.split(':'):null;
 			if(tempObject){
 				this.accidentClaim.IncidentTime = {
 					hour:tempObject[0],
 					minute:tempObject[1],
 					second:0
 				}
 			}else{this.accidentClaim.IncidentTime = null}
 			this.formObjectClone = JSON.stringify(this.accidentClaim);
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

	validateIncidentTime(event:boolean){this.validIncidentTime = event};

	validateemail(email) {
		var testmail = this.accidentClaim.IncidentDetail.EmailTo.toString();
		var regex=/^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4};?)+$/;
		this.validmail = regex.test(testmail);
	}

 	saveAsDraft(form){
 		this.createClaim(1);
 	}

 	submitClaim(){
		this.isSubmited =true;
		for (var i in this.formAC.controls) {
			this.formAC.controls[i].markAsTouched();
		}

		if(this.formAC.invalid ||
			this.accidentClaim.IncidentDate == ''||
			this.accidentClaim.EmploymentTypeId =='null'||
			this.accidentClaim.InjuryDetail.SendToId =='null'||
			this.accidentClaim.InjuryDetail.InjuryNatureId =='null'||
			this.accidentClaim.InjuryDetail.InjuryLocationId =='null'||
			!this.accidentClaim.IncidentTime||
			(this.accidentClaim.IncidentDetail.EmailTo.length!==0 && !this.validmail)
			){
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
 		if(
 			(JSON.stringify(this.accidentClaim) == this.formObjectClone 
 				&& this.attachPhoto.queue.length == 0 
 				&& this.deleteAttachmentArray.length == 0
	 			&& this.formMode =='CREATE' 
 			) ||
			(JSON.stringify(this.accidentClaim) == this.formObjectClone 
				&& this.attachPhoto.queue.length == 0 
				&& this.deleteAttachmentArray.length == 0 
	 			&& this.formMode =='UPDATE' 
	 			&& ClaimStatusId == this.accidentClaim.ClaimStatusId
 			)
		){
 			this.sharedService.toasterMessage({message:this.translationLables.noChange,type:'warning',title:this.translationLables.warning})
 		}else{
			var params:any
			var toasterMsg:any
 			this.loading = true;
 			this.apiProcessing = true;
 			this.accidentClaim.ClaimStatusId = ClaimStatusId;
 			if(this.accidentClaim.IncidentDate){
 				this.accidentClaim.IncidentDate = (this.accidentClaim.IncidentDate.toString().split('GMT'))[0]
			}
			params = JSON.parse(JSON.stringify(this.accidentClaim));
			params.IncidentDetail.EmailTo=params.IncidentDetail.EmailTo.toString();
			params.IncidentTime = (params.IncidentTime)?params.IncidentTime.hour +':'+ params.IncidentTime.minute:null;
 			params.ReferenceNo = (this.formMode == 'UPDATE')?params.ReferenceNo:''
 			this.accidentService.createClaim(params,data=>{
			 	this.referenceNo = (this.formMode == 'UPDATE')?this.referenceNo:data.Message;
			 	toasterMsg = (this.isSubmited)
			 	?this.translationLables.claim +' '+this.referenceNo +' '+ this.translationLables.submitSuccess
			 	:this.translationLables.claim +' '+ this.referenceNo +' '+ this.translationLables.saveSuccess;
			 	this.sharedService.toasterMessage({
			 		message:toasterMsg,
			 		type:'success',
			 		title:this.translationLables.success
			 	})
			 	if(this.attachPhoto.queue.length){
				 	let attachmentURL = this.urlgeneratorService.UploadAccidentFile(this.referenceNo);
				 	for(let inx in this.attachPhoto.queue){
				 		this.attachPhoto.queue[inx].url = attachmentURL;
				 	}
				 	this.attachPhoto.uploadAll();
					this.attachPhoto.onCompleteAll = () => { deleteAttachment(this) }
			 	}else{
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
 			this.accidentClaim.ClaimStatusId = 0;
 		}

 		function deleteAttachment(self:any){
 			self.attachPhoto.queue = [];
 			if(self.deleteAttachmentArray.length){
				self.accidentService.deleteAttachment({
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
			if(self.referenceNo){self.getClaimDetails(self.referenceNo)}
 			self.isSubmited = false;
 			self.timeValid = false;
			self.apiProcessing = false;
			self.loading = false;
		 }
 	}


 	deleteAttachment(id, del){
 		this.accidentClaim.InjuryDetail.Attachment.splice(del,1)
 		this.deleteAttachmentArray.push(id);
 	}

 	confirmResetWindow(template: TemplateRef<any>) {
		this.resetFormRef = this.modalService.show(template, this.modelConfigConfirm);
	}
	resetFormModel(form){
		form.reset()
		this.isSubmited = false;
		this.timeValid = false;
		this.bindTimePicker = false
		if(this.formMode == 'CREATE'){
			setTimeout(()=>{this.initializeModel()},0)
		}else{
			setTimeout(()=>{this.bindTimePicker = true;},0)
			this.getClaimDetails(this.referenceNo)
		}
		this.attachPhoto.queue = [];
		this.resetFormRef.hide();
	}
}
