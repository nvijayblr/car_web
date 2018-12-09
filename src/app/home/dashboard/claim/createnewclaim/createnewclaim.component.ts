import { Component, OnInit, ViewEncapsulation, ViewContainerRef, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { DialogComponent } from '../../../../common/dialog/dialog.component';
import { CreatenewclaimService } from '../../../../services/home/createnewclaim.service';
import { Languageconstant } from '../../../../utill/constants/languageconstant';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import $ from 'jquery';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Constant } from '../../../../utill/constants/constant';
import { FileUploader } from 'ng2-file-upload';
import { LocationStrategy,Location,HashLocationStrategy } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { InitiatorPhone } from '../../../../common/filters/data-filter.pipe';
import {NgxPopperModule} from 'ngx-popper';
import { AuthService } from '../../../../services/auth/auth.service';
import { AccidentService } from '../../../../internal/services/accident/accident.service'
import { SharedService } from '../../../../services/home/shared.service';
import { DashboardService } from '../../../../services/home/dashboard.service';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ExternalToasterService } from '../../../../services/external-toaster/external_toaster.service';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-createnewclaim',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './createnewclaim.component.html',
  styleUrls: ['./createnewclaim.component.scss'],
  providers: [DatePipe,Location, {provide: LocationStrategy, useClass: HashLocationStrategy}]

})
export class CreatenewclaimComponent implements OnInit,AfterViewInit {
  @ViewChild('claimForm') claimForm;

  ngAfterViewInit(){
    this.onAnchorClick(1, true);
  }


  public responseButtonStatus:number=0;
  public capaButtonStatus:number=0;
  public today = new Date();
  public sendEmailToFlag: any = true;
  public claimstatus: any;
  public formClone: any;
  public countryFlag: boolean  = true;
  public requiredClaim: boolean=false;
  public invoiceCustomerName: any;
  public invoicedetailspopulate: any;
  public invoiceNumberHeader: any;
  public invoiceHeader: any;
  public uploaderPalletTicket: FileUploader = new FileUploader({ url: '' });
  public uploaderComplianceFile: FileUploader = new FileUploader({ url: '' });
  public uploadermasterCartonBarcode: FileUploader = new FileUploader({ url: '' });
  public uploaderdefectiveSampleAttach: FileUploader = new FileUploader({ url: '' });
  public expectedDateConfig: Partial<BsDatepickerConfig> = Object.assign({}, { minDate:this.today, showWeekNumbers:false});
  public deliveryDateConfig: Partial<BsDatepickerConfig> = Object.assign({}, { maxDate:this.today, showWeekNumbers:false});
  public isClaimLevelOne:any;
  public isClaimLevelTwo:any;
  public isCapaLevelOne:any;
  public isCapaLevelTwo:any;
  public loading = true;
  public cmpflag =  false;
  public baseURL = '';
  public createNewClaimObjects:any;
  public draftOrSubmitFlag = false;
  public responseFlag = false;
  public InvoiceSearchPopUpView = 'hide';
  public typeofTheField = 'enabled';
  public fileslength;
  public URL = '';
  public apiCallStatus = true;
  public draftedItem = false;
  public SaveWarningPopupShow = 'hide';
  public fileUploaderDefectivPopUp = 'hide';
  public palletTicketFileUploadDetail = [];
  public complianceFileUploadDetail = [];
  public complianceTableData=[];
  public masterCartonBarcodeFileUploadDetail = [];
  public uploaderDefectiveDetail = [];
  public palletTicketFileUploadDetailServer = [];
  public masterCartonBarcodeFileUploadDetailServer = [];
  public uploaderDefectiveDetailServer = [];
  public palletStorageAfterChange = [];
  public cartonStorageAfterChange = [];
  public uploaderDefectiveAfterChange = [];
  public selectedClaimTypeName;
  public userId;
  public titleofView:string;
  public iconEdit = 'hidden';
  public bottomBtnShowStatus = 'true';
  public disableBasic = false;
  public editView = false;
  public disableCustomer = false;
  public disableProduct = false;
  public disableClaim = false;
  public disableAdditional = false;
  public typeOfSubmit:string;
  public isSubmitted = false;
  public claimKeyVal = '';
  public editButtonClick : boolean = false;;
  public showDeleteIcon = false;
  public editableStatusBaisc = false;
  
  public viewClaim = false;
  public userdetails;
  public claimtypeselected = '';
  public custClaimTypeValue='';
  
  public currentComplaintNumber='';
  public searchInvoiceResults= {};
  public searchInvoiceResults1:any=[];
  public compliantNumber = '';
  public closedStatusId:number;
  
  public responsedisplayId=0;
  public capadisplayId=0;
  public CAPAButtonDisplayStatus=0;
  public modalRef: BsModalRef;
  public countryObject =  {
    'Type':'',
    'Symbol':'',
    'Threshold':'',
    'ContactFormat': '',
    'RegexString': []
  }  

  public createNewClaimObject = {
    'custComplaintNo': '',
    'InitiatorEmail': '',
    'custInvoiceNo': '',
    'custSBUSelectedValue': '0',
    'custClaimTypeSelectedValue': null,
    'custInitiator': '',
    'custInitiatorPhone': null,
    'custExtn': '',
    'CreatedDate': this.today,
    'ClosedDate': null,
    'typeofSubmit': '',
    'claimStatusID': 0,
    'currency': '',
    'custInvoiceValue': '',
    'PONo':'',

  };

  public createNewClaimObjectCustomerDetails = {
    'custNameOfCustomer': '',
    'custCustomerNo': '',
    'custCountry': '',
    'custDistributionChannelSelectedValue': '0',
    'custContactPerson': '',
    'custNameOfFinalCust': '',
    'custCustomerPhone': '',
    'custExtn': '',
    'custEmail': '',
    'custModeOFComplaintSelectedValue': '0'
  };

  public createNewClaimObjectProductDetails = {
    'custBrandSelectedValue': '0',
    'custSKUNo': '',
    'custProductDescription': '',
    'custManufacturedBy': '',
    'custDeliveryNo': '',
    'custNoOfDeliveredItems': null,
    'custNoOfDefectedItems': null,
    'custDeliveryDate': null,
    'custComplaintCategorySelectedValue': '0',
    'custDrawingNumberRev': '',
    'custPalletTicket': '',
    'custcompliance': '',
    'custMasterCartonBarcode': '',
    'internalSKUNo': ''
  };

  public createNewClaimObjectClaimDetails:any = {
    'custComplaintStage': '',
    'custComplaintDescri': '',
    'custDefectiveSampleReceivedStatus': false,
    'custDefectivePicturesOfSampleReceivedStatus': false,
    'custDefectivePicturesOfSampleReceivedDate': null,
    'custSelectClaimType': false,
    'custActionStatus': false,
    'custIssueCreditStatus': false,
    'custReturnAutorizationStatus': false,
    'custReplacementStatus': false,
    'custOtherStatus': false,
    'custRAno': '',
    'custPUnitCostFirstRAno':null,
    'custQuantityFisrtRAno':null,
    'custTotalCostFisrtRAno':0,
    'custPUnitCostFirst': 0,
    'additionalCostFirst': 0,
    'custQuantityFisrt': 0,
    'custTotalCostFisrt': 0,
    'custSectionFisrtLbl': '', // Accounts Payable
    'custSectionFisrt': 0,
    'custPUnitCostSecond': 0,
    'custQuantitySecond': 0,
    'custTotalCostSecond': 0,
    'custSectionSecondLbl': '', // Accounts Payable
    'custSectionSecond': 0,
    'custPUnitCostOthers': 0,
    'custQuantityOthers': 0,
    'custTotalCostOthers': 0,
    'custSectionOthersLbl': 0,
    'custSectionOthers': 0,
    'custSectionOthersDescription': '',
    'custNotes': '',
    'custFeedbackImprovement': '',
    'palletTicketAttachments': '',
    'ClaimAttachments': '',
    'masterCartonBarcodeAttachments': '',
    'invoiceSelection':'',
    'custSentEmailTo':[],
    'CAPAFlag':false,
    'TotalClaims':null,
    'TotalAmount':null
  };

  public responsibleDepartmentList  = [];
  public IC_ResponsibleDepartmentId: any;
  public Replmnt_ResponsibleDepartmentId: any;

  public myDeliveryDatePickerOptions: IMyDpOptions = {

    showTodayBtn: false,
    dateFormat: 'mm/dd/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    inline: false,
    showClearDateBtn: false,
    alignSelectorRight: true,
    editableDateField: false,
    openSelectorOnInputClick: true,
    disableSince: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() + 1
    }
  };

  public SBUList:any = [];
  public countryList:any;
  public claimTypeList = [];
  public dropdownDistributionChannel;
  public modeOfComplaintList;
  public brandList;
  public complaintCategoryList;
  public dropdownSection;
  public placeholderHide =false;
  public popperhide = false;
  public responseDropDownStatus:any;
  public responseCloseConfirmWindow:string;
  public deleteAttachmentArray:any;
  public reviewedButtonStatus:any;
  public myDatePickerOptions: IMyDpOptions = {
    showTodayBtn: false,
    dateFormat: 'mm/dd/yyyy',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    inline: false,
    showClearDateBtn: false,
    alignSelectorRight: true,
    editableDateField: false,
    openSelectorOnInputClick: true
  };

  public referenceNo:string;
  public formMode:string;
  public activeTab = 'block-1';
  public claimStatusList = [];
  public emailList = [];
  public validmail = true;

  constructor(
    private router: Router,
    private createnewclaimService: CreatenewclaimService,
    private languageconstant: Languageconstant,
    private toastr: ToastsManager,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    public constant: Constant,
    private vcr: ViewContainerRef,
    private authService: AuthService,
    private elementRef: ElementRef,
    private modalService: BsModalService,
    private sharedService: SharedService,
    private accidentService: AccidentService,
    private dashboardService: DashboardService,
    private location:Location,
    private externalToasterService : ExternalToasterService
  ) {

    this.sharedService.emitChange({current_page: 'CLAIM_PAGE'});
    this.toastr.setRootViewContainerRef(vcr);
    this.baseURL = this.constant.baseURL;

    let auth:any = authService.getAccessLevels('CLMCR');
    this.isClaimLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
    this.isClaimLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;

    auth = authService.getAccessLevels('CLMRESCAPA');
    this.isCapaLevelOne = auth.isLevelOne ? auth.isLevelOne : false;
    this.isCapaLevelTwo = auth.isLevelTwo ? auth.isLevelTwo : false;

    // set dynamic form type
    activatedRoute.url.subscribe((item) => {
      
      this.formMode = item[0].path;
      this.referenceNo = item[1].path;
    });

    if (localStorage.getItem("userData") == null) {
      const link = this.constant.loginURL;
      window.location.href = link;
    }

  }

  dynamicFormChange(type, refId){
    switch (type) {
      case "Createnewclaim":
        this.popperhide= true;
        this.showDeleteIcon = true;
        this.claimtypeselected = refId;
        this.createNewClaimObject.claimStatusID = 1;
        this.disableBasic = false;
        this.editView = false;
        this.disableCustomer = false;
        this.disableProduct = false;
        this.disableClaim = false;
        this.disableAdditional = false;
        this.bottomBtnShowStatus = 'true';
        this.iconEdit = 'hidden';
        this.createNewClaimObject.custInitiator = this.userdetails.FullName; 
        
        this.createNewClaimObject.custInitiatorPhone = this.userdetails.PhoneNumber
        this.createNewClaimObject.custExtn = this.userdetails.Extn
        
        this.createNewClaimObject.custClaimTypeSelectedValue = this.claimtypeselected;
        switch (refId) {
          case "1":
            this.titleofView = 'Consumer';
            this.createNewClaimObject.custClaimTypeSelectedValue = '1';
            this.custClaimTypeValue='Consumer';
            this.requiredClaim = true;
            break;
          case "2":
            this.titleofView = 'Compliance';
            this.createNewClaimObject.custClaimTypeSelectedValue = '2';
            this.custClaimTypeValue='Compliance';
            this.requiredClaim = false;
            break;
          case "3":
              this.titleofView = 'Internal';
              this.createNewClaimObject.custClaimTypeSelectedValue = '3';
              this.custClaimTypeValue='Internal';
            break;
          case "4":
              this.titleofView = 'Customer';
              this.createNewClaimObject.custClaimTypeSelectedValue = '4';
              this.custClaimTypeValue='Customer';
              this.requiredClaim = true;
            break;
        }
        break;
      case "Viewclaim":
        this.titleofView = 'View Claim';
        this.viewClaim = true;
        this.disableBasic = true;
        this.editView = true;
        this.disableCustomer = true;
        this.disableProduct = true;
        this.disableClaim = true;
        this.disableAdditional = true;
        this.bottomBtnShowStatus = 'false';
        this.getClaimViewDetails(refId);
        this.iconEdit = '';
        break;
      
    }
    function viewMode(){

    }
  }

  initializeValue(): void {
    this.dropdownDistributionChannel = [];
    this.draftOrSubmitFlag = false;
    this.responseFlag = false;
    this.uploaderPalletTicket.queue = [];
    this.uploadermasterCartonBarcode.queue = [];
    this.uploaderdefectiveSampleAttach.queue = [];
    this.palletTicketFileUploadDetail = [];
    this.masterCartonBarcodeFileUploadDetail = [];
    this.complianceFileUploadDetail = [];
    this.uploaderComplianceFile.queue = [];
    this.uploaderDefectiveDetail = [];
    this.countryFlag = false;
    const date = new Date();
    this.createNewClaimObject = {
      'custComplaintNo': this.createNewClaimObject.custComplaintNo,
      'custInvoiceNo': '',
      'custSBUSelectedValue': '0',
      'custClaimTypeSelectedValue': this.createNewClaimObject.custClaimTypeSelectedValue,
      'custInitiator': this.createNewClaimObject.custInitiator,
      'custInitiatorPhone': this.userdetails.PhoneNumber,//1275
      'custExtn': this.userdetails.Extn,//1275
      'CreatedDate': this.today,
      'ClosedDate': null,
      'typeofSubmit': '',
      'claimStatusID': 0,
      'InitiatorEmail': '',
      'currency': '',
      'custInvoiceValue': '',
      'PONo': '',      
    };

    this.createNewClaimObjectCustomerDetails = {
      'custNameOfCustomer': '',
      'custCustomerNo': '',
      'custCountry': '',
      'custDistributionChannelSelectedValue': '0',
      'custContactPerson': '',
      'custNameOfFinalCust': '',
      'custCustomerPhone': '',
      'custExtn': '',
      'custEmail': '',
      'custModeOFComplaintSelectedValue': '0'
    };
    this.populateCurrency();
    this.createNewClaimObjectProductDetails = {
      'custBrandSelectedValue': '0',
      'custSKUNo': '',
      'custProductDescription': '',
      'custManufacturedBy': '',
      'custDeliveryNo': '',
      'custNoOfDeliveredItems': null,
      'custNoOfDefectedItems': null,
      'custDeliveryDate': null,
      'custComplaintCategorySelectedValue': '0',
      'custDrawingNumberRev': '',
      'custPalletTicket': '',
      'custcompliance': '',
      'custMasterCartonBarcode': '',
      'internalSKUNo': ''
    };

    this.createNewClaimObjectClaimDetails = {
      // 'custSelectCapa': 'true',
      'custComplaintStage': '',
      'custComplaintDescri': '',
      'custDefectiveSampleReceivedStatus': false,
      'custDefectivePicturesOfSampleReceivedStatus': false,
      'custDefectivePicturesOfSampleReceivedDate': null,
      'custSelectClaimType': false,
      'custActionStatus': false,
      'custIssueCreditStatus': false,
      'custReturnAutorizationStatus': false,
      'custReplacementStatus': false,
      'custOtherStatus': false,
      'custRAno': '',
      'custPUnitCostFirstRAno': null,
      'custQuantityFisrtRAno': null,
      'custTotalCostFisrtRAno': 0,
      'custPUnitCostFirst': 0,
      'additionalCostFirst': 0,
      'custQuantityFisrt': 0,
      'custTotalCostFisrt': 0,
      'custSectionFisrtLbl': (this.responsibleDepartmentList && this.responsibleDepartmentList.length > 0) ? this.responsibleDepartmentList[0].Name : '', // Accounts Payable
      'custSectionFisrt': 0,
      'custPUnitCostSecond': 0,
      'custQuantitySecond': 0,
      'custTotalCostSecond': 0,
      'custSectionSecondLbl': (this.responsibleDepartmentList && this.responsibleDepartmentList.length > 0) ? this.responsibleDepartmentList[0].Name : '', // Accounts Payable
      'custSectionSecond': 0,
      'custPUnitCostOthers': 0,
      'custQuantityOthers': 0,
      'custTotalCostOthers': 0,
      'custSectionOthersLbl': 0,
      'custSectionOthers': 0,
      'custSectionOthersDescription': '',
      'custNotes': '',
      'custFeedbackImprovement': '',
      'palletTicketAttachments': '',
      'ClaimAttachments': '',
      'masterCartonBarcodeAttachments': '',
      'invoiceSelection': '',
      'custSentEmailTo': [],
      'CAPAFlag': false,
      'TotalClaims': null,
      'TotalAmount': null
    };
    
    setTimeout(() => {
      this.countryFlag = true
    }, 100)
  }

  addCustomEmail = (term) => ({Address: term, name: term});
  
  getMailList() {
    this.accidentService.getEmailList(data => {
      this.emailList = (this.emailList == [] ? ((data) ? data : []) : this.emailList.concat(data));
    }, error => {})
  }


  validateemail(_emailsList) {
    this.validmail = true;
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(_emailsList.length!==0) {
      for(let i=0; i<_emailsList.length; i++) {
        if(!regex.test(_emailsList[i])) {
          this.validmail = false;
          return;
        }
      }
    }
    return this.validmail;
  }

  ngOnInit() {
    this.searchInvoiceResults1 = []
    this.closedStatusId = 0;
    this.responseDropDownStatus = '0';
    this.reviewedButtonStatus = false;
    this.responseCloseConfirmWindow = '';
    this.deleteAttachmentArray = [];
    this.userdetails = JSON.parse(localStorage.getItem("userData"));
    this.typeofTheField = 'disabled';

    this.getAllDropdownData();    
    this.uploadfilesAction(undefined);
    this.setNgModelValue();

    $(window).scrollTop(0);    
    const date = new Date();   
    
  }
  
  setPreviousURL() {
    this.sharedService.setPreviousURL(this.router.url);
  }
  uploadfilesAction(responseData) {
    this.URL = this.baseURL + 'api/UpFile?claimId=1040&key=palletKey';

    if (responseData !== undefined) {
      let result;
      result = responseData.Data.Data.split(';');
      if (result[2] != null && result[2] !== undefined) {
        const claimId = result[2].replace(/\s/g, '');
        // this.URL = this.URL + claimId;
        this.claimKeyVal = claimId.replace('ClaimId=', '');
      }
    }

    this.uploaderPalletTicket = new FileUploader({ url: '' });
    this.uploaderPalletTicket.onAfterAddingFile = (fileItem) => {
      if (this.uploaderPalletTicket.queue.length <= 10) {
        this.fileslength = this.uploaderPalletTicket.queue.length;
        let isExist = false;
        for (let i = 0; i < this.palletTicketFileUploadDetail.length; i++) {
          if (this.palletTicketFileUploadDetail[i].name === fileItem.file.name) {
            isExist = true;
            this.uploaderPalletTicket.queue.length = this.uploaderPalletTicket.queue.length - 1;
          }
        }
        if (!isExist) {
          this.palletTicketFileUploadDetail.push(fileItem.file);
        }
        fileItem.withCredentials = false;
        
      } else {
        this.toastr.clearAllToasts();
        this.toastr.error('Maixmum 10 files can attach', 'Failed', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    };
    this.uploaderPalletTicket.onCompleteAll =() => {
      this.uploaderPalletTicket.queue.length = 0
    };



    this.URL = this.baseURL + 'api/UpFile?claimId=1040&key=mcbKey';

    this.uploadermasterCartonBarcode = new FileUploader({ url: '' });
    this.uploadermasterCartonBarcode.onAfterAddingFile = (fileItem) => {
      if (this.uploadermasterCartonBarcode.queue.length <= 10) {
        this.fileslength = this.uploadermasterCartonBarcode.queue.length;
        let isExist = false;
        for (let i = 0; i < this.masterCartonBarcodeFileUploadDetail.length; i++) {
          if (this.masterCartonBarcodeFileUploadDetail[i].name === fileItem.file.name) {
            isExist = true;
            this.uploadermasterCartonBarcode.queue.length = this.uploadermasterCartonBarcode.queue.length - 1;
          }
        }
        if (!isExist) {
          this.masterCartonBarcodeFileUploadDetail.push(fileItem.file);
        }
        fileItem.withCredentials = false;
        
      } else {
        this.toastr.clearAllToasts();
        this.toastr.error('Maixmum 10 files can attach', 'Failed', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    };
    this.uploadermasterCartonBarcode.onCompleteAll =() => {
      this.uploadermasterCartonBarcode.queue.length = 0
    };

    this.URL = this.baseURL + 'api/UpFile?claimId=1040&key=claimKey';

    this.uploaderdefectiveSampleAttach = new FileUploader({ url: '' });
    this.uploaderdefectiveSampleAttach.onAfterAddingFile = (fileItem) => {
      if (this.uploadermasterCartonBarcode.queue.length <= 10) {
        this.fileslength = this.uploaderdefectiveSampleAttach.queue.length;
        let isExist = false;
        for (let i = 0; i < this.uploaderDefectiveDetail.length; i++) {
          if (this.uploaderDefectiveDetail[i].name === fileItem.file.name) {
            isExist = true;
            this.uploaderdefectiveSampleAttach.queue.length = this.uploaderdefectiveSampleAttach.queue.length - 1;
          }
        }
        if (!isExist) {
          this.uploaderDefectiveDetail.push(fileItem.file);
        }
        fileItem.withCredentials = false;

      } else {
        this.toastr.clearAllToasts();
        this.toastr.error('Maixmum 10 files can attach', 'Failed', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    };
    this.uploaderdefectiveSampleAttach.onCompleteAll =() => {
      this.uploaderdefectiveSampleAttach.queue.length = 0
    };

    this.URL = this.baseURL + 'api/uploadComplainceAttachment?claimId=1040&key=complainceKey';
    // element.url = this.baseURL + 'api/uploadComplainceAttachment?claimId=' + this.claimKeyVal + '&key=complainceKey';
    this.uploaderComplianceFile = new FileUploader({ url: '' });
    this.uploaderComplianceFile.onAfterAddingFile = (fileItem) => {
    if(this.uploaderComplianceFile.queue.length>1){
      this.uploaderComplianceFile.queue.splice(this.uploaderComplianceFile.queue.length-2,1);
    }
        var extn = this.uploaderComplianceFile.queue[0].file.name.split(".").pop();
        extn = extn.toString();
        if (extn !== 'xlsx') {
          this.toastr.error('Only Excel type files can be uploaded', '', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
          this.complianceFileUploadDetail = [];
          this.uploaderComplianceFile.queue=[];
        } else {
          this.complianceFileUploadDetail = [];
          fileItem.withCredentials = false;
          this.complianceFileUploadDetail.push(fileItem.file);
          if (this.uploaderComplianceFile.queue.length >= 1) {
            this.cmpflag=false;
            for (let i = 0; i < this.complianceFileUploadDetail.length; i++) {
              if (this.complianceFileUploadDetail[i].name === fileItem.file.name) {
                // isExist = true;
                this.uploaderComplianceFile.queue.length = this.uploaderComplianceFile.queue.length;
              }
            }
          }
        }
      }

    this.uploaderComplianceFile.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      let res:any = response?JSON.parse(response):{}
      this.uploaderComplianceFile.queue.length = 0 ;
      if(res.ResponseCode && res.ResponseCode!= 200){
        this.toastr.error(res.ResponseMessage,'Upload Failed' , {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    };
  }

  calluploadAllfile(claim_id): void {
    // if (response !== undefined) {
    //   let result;
    //   if (response.Data.Data !== null) {
    //     result = response.Data.Data.split(';');
    //     if (result[2] != null && result[2] !== undefined) {
    //       const claimId = result[2].replace(/\s/g, '');
    //       // this.URL = this.URL + claimId;
    //       this.claimKeyVal = claimId.replace('ClaimId=', '');
    //     }
    //   }
    // }
    this.claimKeyVal = claim_id;
    for (let index = 0; index < this.uploaderPalletTicket.queue.length; index++) {
      const element = this.uploaderPalletTicket.queue[index];
      if (element.url !== undefined) {
        element.url = this.baseURL + 'api/external/FileUpload?claimId=' + this.claimKeyVal + '&key=palletKey';

      }
    }
    for (let index = 0; index < this.uploadermasterCartonBarcode.queue.length; index++) {
      const element = this.uploadermasterCartonBarcode.queue[index];
      if (element.url !== undefined) {
        element.url = this.baseURL + 'api/external/FileUpload?claimId=' + this.claimKeyVal + '&key=mcbKey';
      }
    }
    for (let index = 0; index < this.uploaderdefectiveSampleAttach.queue.length; index++) {
      const element = this.uploaderdefectiveSampleAttach.queue[index];
      if (element.url !== undefined) {
        element.url = this.baseURL + 'api/external/FileUpload?claimId=' + this.claimKeyVal + '&key=claimKey';
      }
    }
    if (this.claimKeyVal) {
      for (let index = 0; index < this.uploaderComplianceFile.queue.length; index++) {
        const element = this.uploaderComplianceFile.queue[index];
        if (element.url !== undefined) {
          // element.url = this.baseURL + 'api/UpFile?claimId=' + this.claimKeyVal + '&key=complainceKey';
          element.url = this.baseURL + 'api/uploadComplainceAttachment?claimId=' + this.claimKeyVal + '&key=complainceKey';
        }
      }
    }
    if (this.uploaderPalletTicket.queue.length > 0) {
      for(var i=0;i<this.uploaderPalletTicket.queue.length;i++){
      this.uploaderPalletTicket.uploadItem(this.uploaderPalletTicket.queue[i]);

      }
      // this.uploaderPalletTicket.uploadItem(this.uploaderPalletTicket.queue[0]);
    }
    if (this.uploadermasterCartonBarcode.queue.length > 0) {
      for(var i=0;i<this.uploadermasterCartonBarcode.queue.length;i++){
      this.uploadermasterCartonBarcode.uploadItem(this.uploadermasterCartonBarcode.queue[i]);
      }
    }
    if (this.uploaderdefectiveSampleAttach.queue.length > 0) {
       for(var i=0;i<this.uploaderdefectiveSampleAttach.queue.length;i++){
      this.uploaderdefectiveSampleAttach.uploadItem(this.uploaderdefectiveSampleAttach.queue[i]);
       }
    }
     if (this.uploaderComplianceFile.queue.length > 0) {
        for(var i=0;i<this.uploaderComplianceFile.queue.length;i++){
      this.uploaderComplianceFile.uploadItem(this.uploaderComplianceFile.queue[i]);
        }
    }

  }

  callDeleteAttchamnet(reqBody): void {
    this.loading = false;
    // api call
    this.createnewclaimService.deleteExternalAttachment(reqBody, response => {
      this.loading = false;
      if (response.StatusCode === "SUCCESS") {
        this.dataBindinViewMode(response.Data);
        this.claimTypeChange(response.Data.ClaimDetails.ClaimTypeId)
        return
      } else {
      }
    }, error => {
      this.loading = false;
       return
    });
  }

  onPalletChange(palletTicketName: string, isChecked: boolean, AttachmentID: number): void {

    for (let i = 0; i < this.palletTicketFileUploadDetail.length; i++) {
      if (this.palletTicketFileUploadDetail[i].name == palletTicketName) {
        if (this.palletTicketFileUploadDetail[i].path != undefined) {
          this.palletTicketFileUploadDetailServer.push({
            'name': this.palletTicketFileUploadDetail[i].name,
            'path': this.palletTicketFileUploadDetail[i].path,
          })
          this.palletTicketFileUploadDetail.splice(i, 1);
          const reqBody = {
            'AttachmentID': AttachmentID,
            'Key': 'palletKey'
          }
          this.deleteAttachmentArray.push(reqBody)
        } else {
          this.palletTicketFileUploadDetail.splice(i, 1);
        }
      }
    }

    for (let j = 0; j < this.uploaderPalletTicket.queue.length; j++) {
      if (this.uploaderPalletTicket.queue[j].file.name === palletTicketName) {
        this.uploaderPalletTicket.queue.splice(j, 1);
      }
    }

    if (this.palletTicketFileUploadDetail.length === 0) {
      this.modalRef.hide();
    }
  }

  onComplianceChange(ComplianceName: string, isChecked: boolean, AttachmentID: number): void {

    for (let i = 0; i < this.complianceFileUploadDetail.length; i++) {
      if (this.complianceFileUploadDetail[i].name === ComplianceName) {
        if (this.complianceFileUploadDetail[i].path !== undefined) {
          this.complianceFileUploadDetail.splice(i, 1);
          const reqBody = {
            'AttachmentID': AttachmentID,
            'Key': 'fishboneKey'
          }
          this.deleteAttachmentArray.push(reqBody)
        } else {
          this.complianceFileUploadDetail.splice(i, 1);
        }
      }
    }

    for (let j = 0; j < this.uploaderComplianceFile.queue.length; j++) {
      if (this.uploaderComplianceFile.queue[j].file.name === ComplianceName) {
        this.uploaderComplianceFile.queue.splice(j, 1);
      }
    }

    if (this.complianceFileUploadDetail.length === 0) {
      this.modalRef.hide();
    }
  }

  onCartonChange(masterCartonName: string, isChecked: boolean, AttachmentID: number): void {

    for (let i = 0; i < this.masterCartonBarcodeFileUploadDetail.length; i++) {
      if (this.masterCartonBarcodeFileUploadDetail[i].name == masterCartonName) {
        if (this.masterCartonBarcodeFileUploadDetail[i].path != undefined) {
          this.masterCartonBarcodeFileUploadDetailServer.push({
            'name': this.masterCartonBarcodeFileUploadDetail[i].name,
            'path': this.masterCartonBarcodeFileUploadDetail[i].path,
          })
          this.masterCartonBarcodeFileUploadDetail.splice(i, 1);
          const reqBody = {
            'AttachmentID': AttachmentID,
            'Key': 'mcbKey'
          }
          this.deleteAttachmentArray.push(reqBody)
        } else {
          this.masterCartonBarcodeFileUploadDetail.splice(i, 1);
        }
      }
    }

    for (let j = 0; j < this.uploadermasterCartonBarcode.queue.length; j++) {
      if (this.uploadermasterCartonBarcode.queue[j].file.name === masterCartonName) {
        this.uploadermasterCartonBarcode.queue.splice(j, 1);
      }
    }

    if (this.masterCartonBarcodeFileUploadDetail.length === 0) {
      this.modalRef.hide();
    }
  }

  onUploaderDefectiveChange(uploaderDefectiveName: string, isChecked: boolean, AttachmentID: number): void {

    for (let i = 0; i < this.uploaderDefectiveDetail.length; i++) {
      if (this.uploaderDefectiveDetail[i].name == uploaderDefectiveName) {
        if (this.uploaderDefectiveDetail[i].path != undefined) {
          this.uploaderDefectiveDetailServer.push({
            'name': this.uploaderDefectiveDetail[i].name,
            'path': this.uploaderDefectiveDetail[i].path,
          })
          this.uploaderDefectiveDetail.splice(i, 1);
          let reqBody = {
            'AttachmentID': AttachmentID,
            'Key': 'claimKey'
          }
          this.deleteAttachmentArray.push(reqBody)
          
        } else {
          this.uploaderDefectiveDetail.splice(i, 1);
        }
      }
    }

    for (let j = 0; j < this.uploaderdefectiveSampleAttach.queue.length; j++) {
      if (this.uploaderdefectiveSampleAttach.queue[j].file.name == uploaderDefectiveName) {
        this.uploaderdefectiveSampleAttach.queue.splice(j, 1);
      }
    }

    if (this.uploaderDefectiveDetail.length === 0) {
      this.modalRef.hide();
    }
  }

  openfile(sURL): void {
    if (sURL !== undefined) {
      // sURL = 'https://www.w3schools.com/html/'
      window.open(sURL);
    }
  }

  getClaimViewDetails(val): void {
    this.loading = true;
    this.uploaderPalletTicket.queue = [];
    this.uploadermasterCartonBarcode.queue = [];
    this.uploaderdefectiveSampleAttach.queue = [];
    this.palletTicketFileUploadDetail = [];
    this.masterCartonBarcodeFileUploadDetail = [];
    this.complianceFileUploadDetail =[];
    this.uploaderComplianceFile.queue=[];
    this.uploaderDefectiveDetail = [];
    // api call
    this.createnewclaimService.getClaimDetails(val, response => {
      this.loading = false;
      if(response.ResponseCode==413 || response.ResponseCode==414){
        window.location.href = this.constant.loginURL;
      }else if (response.Data) {
     
        this.responseButtonStatus=response.Data.ClaimDetails.ResponseButtonStatus!=null?response.Data.ClaimDetails.ResponseButtonStatus:0;
        this.capaButtonStatus=response.Data.ClaimDetails.CAPAButtonStatus!=null?response.Data.ClaimDetails.CAPAButtonStatus:0;
        this.compliantNumber = response.Data.ComplaintNumber;
        this.editableStatusBaisc = true;
        this.dataBindinViewMode(response.Data);
        this.claimTypeChange(response.Data.ClaimDetails.ClaimTypeId);
        this.showDeleteIcon = false;
        this.capadisplayId=response.Data.ClaimDetails.CAPAID!=null?response.Data.ClaimDetails.CAPAID:0;
        this.responsedisplayId=response.Data.ClaimDetails.ClaimResposeID;


        this.claimstatus=this.setClaimStatusName(response.Data.ClaimDetails.ClaimStatusID);


        this.CAPAButtonDisplayStatus=response.Data.ClaimDetails.CAPAButtonStatus;
      } else {
        this.toastr.error('Internal Server Error', 'Failed', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    }, error => {
      this.toastr.error('Internal Server Error', 'Failed', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
      });
    });
   
  }

  onCapaBtnClick(details): void {
    const link = ['dashboard/CAPA'];
    this.router.navigate(link);
    this.router.navigate(['CAPA', details], { relativeTo: this.activatedRoute.parent });

  }  

  datePickerFormat(dateString): any {
    let dd = {};
    if (dateString) {
      let newDate = new Date(dateString);
      dd = { date: { year: newDate.getFullYear(), month: newDate.getMonth() + 1, day: newDate.getDate() } };
    }
    return dd;
  }

  dataBindinViewMode(data): void {
    this.sendEmailToFlag = false;
    const date = new Date();
    this.claimstatus = this.setClaimStatusName(data.ClaimDetails.ClaimStatusID);

    if (data.ClaimAttachments != null && data.ClaimAttachments.length > 0) {
      if (data.ClaimAttachments.length > 0) {
        this.uploaderDefectiveDetail = [];
        for (let i = 0; i < data.ClaimAttachments.length; i++) {
          this.uploaderDefectiveDetail.push({ 'name': data.ClaimAttachments[i].FileName, 'path': data.ClaimAttachments[i].FilePath, 'AttachmentID': data.ClaimAttachments[i].AttachmentID })
        }
      }
    }

    if (data.PalletTicketAttachments != null && data.PalletTicketAttachments.length > 0) {
      if (data.PalletTicketAttachments.length > 0) {
        this.palletTicketFileUploadDetail = [];
        for (let i = 0; i < data.PalletTicketAttachments.length; i++) {
          this.palletTicketFileUploadDetail.push({ 'name': data.PalletTicketAttachments[i].FileName, 'path': data.PalletTicketAttachments[i].FilePath, 'AttachmentID': data.PalletTicketAttachments[i].AttachmentID })
        }
      }
    }

    if (data.MasterCartonBarcodeAttachments != null && data.MasterCartonBarcodeAttachments.length > 0) {
      if (data.MasterCartonBarcodeAttachments.length > 0) {
        this.masterCartonBarcodeFileUploadDetail = [];
        for (let i = 0; i < data.MasterCartonBarcodeAttachments.length; i++) {
          this.masterCartonBarcodeFileUploadDetail.push({ 'name': data.MasterCartonBarcodeAttachments[i].FileName, 'path': data.MasterCartonBarcodeAttachments[i].FilePath, 'AttachmentID': data.MasterCartonBarcodeAttachments[i].AttachmentID })
        }
      }
    }
    if (data.ComplainceClaimAttachment != null) {
      this.cmpflag=true;
      this.complianceFileUploadDetail = [];
       this.complianceFileUploadDetail.push({ 'name': data.ComplainceClaimAttachment.FileName, 'path': data.ComplainceClaimAttachment.FilePath, 'AttachmentID': data.ComplainceClaimAttachment.AttachmentID })
       this.currentComplaintNumber=data.ComplaintNumber;
    }

    this.createNewClaimObject = {
      'custComplaintNo': data.ComplaintNumber,
      'custInvoiceNo': data.ClaimDetails.InvoiceNumber,
      'custSBUSelectedValue': data.ClaimDetails.SBUId,  
      'custClaimTypeSelectedValue': data.ClaimDetails.ClaimTypeId,  
      'custInitiator':data.InitiatorDetails.InitiatorName, 
      'custInitiatorPhone': data.InitiatorDetails.InitiatorPhone,
      'custExtn': data.InitiatorDetails.Extension,
      'CreatedDate': data.ClaimDetails.CreatedDate,
      'ClosedDate': data.ClaimDetails.ClosedDate,
      'typeofSubmit': '',
      'claimStatusID': 0,
      'InitiatorEmail': '',
      'currency': data.ClaimDetails.InvoiceCurrency,
      'custInvoiceValue': data.ClaimDetails.InvoiceValue,
      'PONo':data.ClaimDetails.PONumber,


    };
    data.ClaimDetails.ClaimTypeId
    this.custClaimTypeValue=this.setClaimType(data.ClaimDetails.ClaimTypeId); 
    this.requiredClaim = (this.custClaimTypeValue =='Compliance')?false:true
    this.createNewClaimObjectCustomerDetails = {
      'custNameOfCustomer': data.CustomerDetails.CustomerName,
      'custCustomerNo': data.CustomerDetails.CustomerNumber,
      'custCountry': data.CustomerDetails.Country.CountryID, 
      'custDistributionChannelSelectedValue': data.CustomerDetails.DistributionChannelID, 
      'custContactPerson': data.CustomerDetails.ContactPerson,
      'custNameOfFinalCust': data.CustomerDetails.FinalCustomerName,
      'custCustomerPhone': data.CustomerDetails.CustomerPhone,
      'custExtn': data.CustomerDetails.Extn,
      'custEmail': data.CustomerDetails.Email,
      'custModeOFComplaintSelectedValue': data.CustomerDetails.ModeOfComplaintID 
    };
    this.populateCurrency()
    if (data.ProductDetails.DeliveryDate == null) {
      data.ProductDetails.DeliveryDate = '';
    }
    this.createNewClaimObjectProductDetails = {
      'custBrandSelectedValue':data.ProductDetails.BrandID, // this.setBrandName(data.ProductDetails.BrandID), //data.ProductDetails.BrandID,
      'custSKUNo': data.ProductDetails.SKUNumber,
      'custProductDescription': data.ProductDetails.ProductDescription,
      'custManufacturedBy': data.ProductDetails.ManufacturedBy,
      'custDeliveryNo': data.ProductDetails.DeliveryNumber,
      'custNoOfDeliveredItems': data.ProductDetails.NoOfDeliveredItems,
      'custNoOfDefectedItems': data.ProductDetails.NoOfDefectedItems,
      'custDeliveryDate': (data.ProductDetails.DeliveryDate)?new Date(data.ProductDetails.DeliveryDate):null,
      'custComplaintCategorySelectedValue': data.ProductDetails.ComplaintCategoryID, 
      'custDrawingNumberRev': data.ProductDetails.DrawingNumberRev,
      'custPalletTicket': data.ProductDetails.PalletteTicketID, 
      'custcompliance': data.ProductDetails.ComplianceTicketID, 
      'custMasterCartonBarcode': data.ProductDetails.MasterCartonBarcodeID, 
      'internalSKUNo' : data.ProductDetails.InternalSKU
    };

    this.createNewClaimObjectClaimDetails = {
      'custComplaintStage': data.ActionRequested.ComplaintStage,
      'custComplaintDescri': data.ActionRequested.ComplaintDesc,
      'custDefectiveSampleReceivedStatus': (data.ActionRequested.IsDefSamplesReceived),
      'custDefectivePicturesOfSampleReceivedStatus': (data.ActionRequested.IsPicDefSamplesReceived),

      'custDefectivePicturesOfSampleReceivedDate': (data.ActionRequested.ExpDateRcvSamples)?new Date(data.ActionRequested.ExpDateRcvSamples):null,
      'custSelectClaimType': (data.ClaimDetails.IsMajorClaim), 
      'custActionStatus': (data.ActionRequested.IsCommertialAction),
      'custIssueCreditStatus': (data.ActionRequested.IsIssueCredit),
      'custReturnAutorizationStatus': (data.ActionRequested.IsRA),
      'custReplacementStatus': (data.ActionRequested.IsReplacement),
      'custOtherStatus': (data.ActionRequested.IsRemarks),
      'custRAno': data.ActionRequested.RANumber,
      'custPUnitCostFirstRAno':data.ActionRequested.ReturnAuthUnitCost,
      'custQuantityFisrtRAno':data.ActionRequested.ReturnAuthQuantity,
      'custTotalCostFisrtRAno':data.ActionRequested.ReturnAuthTotalCost,
      'custPUnitCostFirst': data.ActionRequested.ICUnitCost,
      'additionalCostFirst': data.ActionRequested.IssueCreditAdditionalCost,
      'custQuantityFisrt': data.ActionRequested.ICQuantity,
      'custTotalCostFisrt': data.ActionRequested.ICTotalCost,
      'custSectionFisrtLbl': '', // Accounts Payable
      'custSectionFisrt': '0',
      'custPUnitCostSecond': data.ActionRequested.ReplacementUnitCost,
      'custQuantitySecond': data.ActionRequested.ReplacementQuantity,
      'CAPAFlag': data.ActionRequested.CAPAFlag,
      'custTotalCostSecond': data.ActionRequested.ReplacementTotalCost,
      'custSectionSecondLbl': '', // Accounts Payable
      'custSectionSecond': '0',
      'custPUnitCostOthers': '',
      'custQuantityOthers': 0,
      'custTotalCostOthers': 0,
      'custSectionOthersLbl': '',
      'custSectionOthers': '0',
      'custNotes': data.ClaimDetails.Notes,
      'custFeedbackImprovement': data.ClaimDetails.Feedback,
      'custSentEmailTo': (data.ClaimDetails.sendEmailsTo)?data.ClaimDetails.sendEmailsTo.split(','):[],
      'custSectionOthersDescription': data.ActionRequested.Remarks,
      'palletTicketAttachments': data.PalletTicketAttachments,
      'ClaimAttachments': data.ClaimAttachments,
      'masterCartonBarcodeAttachments': data.MasterCartonBarcodeAttachments,      
       'invoiceSelection':'',
       'TotalClaims':(data.ClaimDetails)?data.ActionRequested.TotalClaims:'',
       'TotalAmount':(data.ClaimDetails)?data.ActionRequested.TotalAmount:'',
    };
    
    this.createNewClaimObjectClaimDetails.custSectionFisrtLbl = this.setResponsibleDeptName(data.ActionRequested.ICResponsibleDepartmentId);
    this.createNewClaimObjectClaimDetails.custSectionSecondLbl = this.setResponsibleDeptName(data.ActionRequested.ReplacementResponsibleDepartmentId);
  
    var item:any;

    var emailObject = JSON.parse(JSON.stringify(this.createNewClaimObjectClaimDetails.custSentEmailTo))
    this.createNewClaimObjectClaimDetails.custSentEmailTo = [];
    for( item of emailObject){
      if(this.emailList.findIndex(x => x.Address == item) == -1){
        this.emailList.push({
          Address:item,
          Id:null,
          Name:null
        })
      }
     } 
     this.validateemail(this.createNewClaimObjectClaimDetails.custSentEmailTo)
    setTimeout(()=>{
      this.getDistributionChannels(data.ClaimDetails.SBUId, data.CustomerDetails.DistributionChannelID);//pre load distr channel list
      this.sendEmailToFlag = true;
    },800)

     this.createNewClaimObjectClaimDetails.custSentEmailTo = JSON.parse(JSON.stringify(emailObject))
     
    this.createNewClaimObject.claimStatusID = data.ClaimDetails.ClaimStatusID;    
    
  }

  goSearchview(modal?:TemplateRef<any>): void {
    if((this.formMode !='Viewclaim') || (this.formMode =='Viewclaim' && this.disableClaim)){
        
      let url=this.sharedService.getPreviousURL();
      if (url ==null)
        this.router.navigate(['landing']);
      else
        this.router.navigate([url]);

      
      return
    } else {
      this.modalRef = this.modalService.show(modal, {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true});
    }
  }

  onSaveWarningYesClick() {
    this.modalRef.hide();
    this.router.navigate(['dashboard']);

  }

  setNgModelValue(): void {
    this.createNewClaimObject = this.createNewClaimObject;
    this.createNewClaimObjectCustomerDetails = this.createNewClaimObjectCustomerDetails;
    this.createNewClaimObjectProductDetails = this.createNewClaimObjectProductDetails;
    this.createNewClaimObjectClaimDetails = this.createNewClaimObjectClaimDetails;
  }

  claimTypeChange(selectedValue): void {
    this.valuechangeReplacement("");
    this.valuechangeIssueCredt("");
    // this.claimTypeList
    if (this.claimTypeList !== undefined) {
      this.apiCallStatus = true;
      for (let i = 0; i < this.claimTypeList.length; i++) {
        if (this.claimTypeList[i].SectionID === Number(selectedValue)) {
          this.selectedClaimTypeName = this.claimTypeList[i].Section;
          if (this.selectedClaimTypeName === 'Internal') {
            this.createNewClaimObjectClaimDetails.custActionStatus = false;
            $('#actionRequested').attr('disabled', true);
            $('#noActionNeeded').attr('disabled', true);
          } else {
            $('#actionRequested').attr('disabled', false);
            $('#noActionNeeded').attr('disabled', false);
          }
        }
      }
    }
  }

  stateChangesStatus(): void {
    this.apiCallStatus = true;
    this.reviewedButtonStatus = true;
  }  

  // Invoice and PO number format begin
  bDetailsValidate(field:string){
    let mValue:string;
    var self = this;//copy to functional scope
    switch (field) {
      case "po":
        mValue = (self.createNewClaimObject.PONo)?self.createNewClaimObject.PONo:'';
        self.bDetailsValidateUtility(mValue, function(result){
            self.createNewClaimObject.PONo = result.join(", ");
        })
        break;
      case "invoice":
        mValue = (self.createNewClaimObject.custInvoiceNo)?self.createNewClaimObject.custInvoiceNo:'';
        self.bDetailsValidateUtility(mValue, function(result){
          self.createNewClaimObject.custInvoiceNo = result.join(", ");
        })
        break;
      default:
        break;
    }
  }
  //utility function
  bDetailsValidateUtility(mValue:string, callback){
    let filteredArray:any = [];
    let rawArray:any = [];
    rawArray = mValue.split(',')
    for (var inx in rawArray) {
      let temp:string = rawArray[inx];
      if(temp!='0' && temp.length <= 10 && temp.length >= 1){
        filteredArray.push(temp)
      }else if(temp.length > 10){
        temp = temp.trim();
        temp = temp.substring(0, 10);
        filteredArray.push(temp)
      }else{}
    }
    callback(filteredArray);
  }
  // Invoice and PO number format End

  populateCurrency() {
    let self = this;
    var tempArray = (this.countryList) ? this.countryList : []
    let ctryID: any = self.createNewClaimObjectCustomerDetails.custCountry;
    self.createNewClaimObjectCustomerDetails.custCountry = (ctryID != '') ? ctryID : tempArray[0].CountryID;
    let tempObject = tempArray.find(row => {
      return (row.CountryID == self.createNewClaimObjectCustomerDetails.custCountry)
    });
    if (tempObject) {
      let temp = tempObject.RegexString.split(','), inputMask: any = [];
      temp.map(function (val, i) {
        if (val == '/\\d/' || val == /\\d/) {
          inputMask[i] = /\d/;
        } else {
          inputMask[i] = val;
        }
      });
      this.countryObject = {
        'Symbol': tempObject.CurrencySymbol,
        'Type': tempObject.Currency,
        'Threshold': tempObject.Threshold,
        'ContactFormat': tempObject.ContactFormat,
        'RegexString': inputMask
      }
    }

  }
  getAllDropdownData(): void {
    this.getClaimTypes();
    this.getSBUList();
    this.getBrandList(); 
    this.getComplaintCategory(); 
    this.getModeOfComplaintList(); 
    this.getResponsibleDeptList(); 
    this.getCountryList(); 
    this.getMailList(); 
    this.getClaimStatusList(); 

    this.dynamicFormChange(this.formMode, this.referenceNo)
  }
  updateStatusChange(status){
    if(this.closedStatusId == status){
      this.responseCloseConfirmWindow = 'show'
    }
  }

  getCountryList(): void {
      this.createnewclaimService.getCountryList('', response => {
        let dataArray = (response.Data) ? response.Data : {};
        this.countryList = (dataArray) ? dataArray : [];
        this.populateCurrency();
        
      }, error => {

      });
  }
 
  showResetConfirm(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true });
  }

  showPalletUploadModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true});
  }

  showComplianceUploadPopUp(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true});
  }

  showFileMasterCartonUploadModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true});
  }

  showfileUploaderDefectivPopUp(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'd-flex align-self-center modal-md', ignoreBackdropClick: true});
  }

  onResetYes(): void {
    this.modalRef.hide()
    this.disableClaim = false;
    this.fileslength = 0;
    this.createNewClaimObjects = [];
    if(this.formMode=='Viewclaim'){
      setTimeout(()=>{
        this.getClaimViewDetails(this.referenceNo)
      },0);
    }else{
      this.initializeValue();
    }
    Object.keys(this.claimForm.controls).forEach(control => {
        this.claimForm.controls[control].markAsPristine();
        this.claimForm.controls[control].markAsUntouched();
    });
    var RESETSUCCESS = this.externalToasterService.getMessageFromCode('RESETSUCCESS');
    this.onSuccessToastMessage(RESETSUCCESS);
  }

  completeReset(): void {

  }

  onSaveDraftClick(): void {
    var DRAFTSUCCESS =  this.externalToasterService.getMessageFromCode('DRAFTSUCCESS');
    this.onSuccessToastMessage(DRAFTSUCCESS);
  }

  removeFileFromQueue(label: string) {
    // for (let i = 0; i < this.uploader.queue.length; i++) {
    //   if (this.uploader.queue[i].alias === label) {
    //     this.uploader.queue[i].remove();
    //     return;
    //   }
    // }
  }

  onSubmitClick(type): void {
    this.validateemail(this.createNewClaimObjectClaimDetails.custSentEmailTo)
    if(this.claimForm.invalid || !this.validmail ||
      ( this.createNewClaimObject.custSBUSelectedValue == '0' ||
        this.createNewClaimObjectCustomerDetails.custDistributionChannelSelectedValue =='0')||
      ( this.requiredClaim &&(
        this.createNewClaimObjectCustomerDetails.custModeOFComplaintSelectedValue =='0' ||
        this.createNewClaimObjectProductDetails.custBrandSelectedValue =='0'||
        this.createNewClaimObjectProductDetails.custComplaintCategorySelectedValue =='0'))
    ){
       this.toastr.warning('Please enter all mandatory fields or valid data', 'Warning', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
      });
      for (var i in this.claimForm.controls) {
        this.claimForm.controls[i].markAsTouched();
      }
       return;
    }

    let DefectiveItems = this.createNewClaimObjectProductDetails.custNoOfDefectedItems;
    let DeliveredItems = this.createNewClaimObjectProductDetails.custNoOfDeliveredItems;
    if((DefectiveItems && DeliveredItems) && (Number(DefectiveItems) > Number(DeliveredItems))){
      this.toastr.warning('No.of defective items should be less than No.of delivered items', 'Warning', {
        showCloseButton: true, toastLife: this.constant.toastTime
      });
      return;
    }

    let IC_Quantity = this.createNewClaimObjectClaimDetails.custQuantityFisrt;
    if(IC_Quantity && Number(IC_Quantity) > Number(DefectiveItems)){
      this.toastr.warning('Issue Credit Quantity should be less than No.of defective items', 'Warning', {
        showCloseButton: true, toastLife: this.constant.toastTime
      });
      return;
    }

    let RC_Quantity = this.createNewClaimObjectClaimDetails.custQuantityFisrtRAno;
    if(RC_Quantity && Number(RC_Quantity) > Number(DefectiveItems)){
      this.toastr.warning('Return Authorization Quantity should be less than No.of defective items', 'Warning', {
        showCloseButton: true, toastLife: this.constant.toastTime
      });
      return;
    }

    let R_Quantity = this.createNewClaimObjectClaimDetails.custQuantitySecond;
    if(R_Quantity && Number(R_Quantity) > Number(DefectiveItems)){
      this.toastr.warning('No.of Replacement Quantity should be less than No.of defective items', 'Warning', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
      });
      return;
    }

    if (this.createNewClaimObjectProductDetails.custDeliveryDate) {
      var dateCreate = new Date(this.createNewClaimObject.CreatedDate).setHours(0,0,0,0);
      var dateDeliver = new Date(this.createNewClaimObjectProductDetails.custDeliveryDate).setHours(0,0,0,0);
      if (dateCreate < dateDeliver) {
        this.toastr.warning('Delivery date should be before the Create Date', 'Warning', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
        return;
      }
    }


    if (this.createNewClaimObjectClaimDetails.custDefectivePicturesOfSampleReceivedDate) {
      var dateCreate = new Date(this.createNewClaimObject.CreatedDate).setHours(0,0,0,0);
      var dateReceive = new Date(this.createNewClaimObjectClaimDetails.custDefectivePicturesOfSampleReceivedDate).setHours(0,0,0,0);

      
      if (dateCreate > dateReceive) {
        this.toastr.warning('Expected Date to Receive Samples should be greater than claim creation date', 'Warning', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
        return;
      }
    }

    if (this.createNewClaimObject.ClosedDate) {
      var dateCreate = new Date(this.createNewClaimObject.CreatedDate).setHours(0,0,0,0);
      var closeDate = new Date(this.createNewClaimObject.ClosedDate).setHours(0,0,0,0);
      if (dateCreate > closeDate) {
        this.toastr.warning('Close date should be after the Create Date', 'Warning', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
        return;
      }
    }

    let Threshold = parseInt(this.countryObject.Threshold);
    if ((Number(this.createNewClaimObjectClaimDetails.custTotalCostFisrt) > Threshold ) &&
      !this.createNewClaimObjectClaimDetails.custSelectClaimType &&
      this.createNewClaimObjectClaimDetails.custActionStatus) {
      this.toastr.warning(`Total cost should not exceed ${this.countryObject.Symbol + Threshold} for minor claims`, 'Warning', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
      });
      return;
    }
    if(this.formMode!='Viewclaim'){
      this.createNewClaimObject.custClaimTypeSelectedValue = this.referenceNo;
    }
    this.typeOfSubmit = 'submit';

    if (this.createNewClaimObject.claimStatusID == 5) {
      this.createNewClaimObject.ClosedDate = null;
    } else {
      if (!this.createNewClaimObjectClaimDetails.custSelectClaimType) {
        if (this.createNewClaimObjectClaimDetails.custTotalCostFisrt <= Threshold) {
          this.createNewClaimObject.ClosedDate = this.createNewClaimObject.CreatedDate;
        }
        if (this.createNewClaimObjectClaimDetails.custTotalCostSecond <= Threshold) {
          this.createNewClaimObject.ClosedDate = this.createNewClaimObject.CreatedDate;
        }
      }
    }
    this.createNewClaim();
  }

  validateTotalAmountCC(value){
    var res = value.split(".");
    if(res.length >1){
      value = parseFloat(value).toFixed(4)
    }
    return value;
  }

  formatDate(dateString): any {
    let dd = '';
    if (dateString) {
      if (dateString.date !== undefined) {
        dd = this.datePipe.transform(new Date(dateString.date.year, dateString.date.month - 1, dateString.date.day), 'yyyy-MM-dd');
      } else {
        dd = dateString;
      }
    }
    return dd;
  }

  formatCost(cost){
    if(isNaN(cost)){return 0}
    let ary = cost.split('.');
    let str = ary[0] +'.'+(ary[1]?ary[1]:'');
    let num = Number(str).toFixed(4);
    return Number(num)
  }

  onDraftClick(type): void {
    this.toastr.clearAllToasts();
    if (
        !this.createNewClaimObject.custSBUSelectedValue ||
        this.createNewClaimObject.custSBUSelectedValue =='0'||
        this.createNewClaimObject.custSBUSelectedValue == ''
      ){
      this.toastr.warning('Please select valid sales business unit', 'Warning', {
        showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
      });
    }else {
      this.typeOfSubmit = 'draft';
      this.draftOrSubmitFlag = false;
      this.createNewClaim();
    }
  }

  createNewClaim(): void {
    this.loading = true;
    this.createNewClaimObjects = [];
    var custComplaintNoRef = this.createNewClaimObject.custComplaintNo;

    if( this.titleofView == 'Internal' ||
        this.titleofView == 'Customer' ||
        this.titleofView == 'Consumer' ||
        this.titleofView == 'Compliance'
    ){
      this.createNewClaimObject.InitiatorEmail = this.userdetails.EmailId;
      this.createNewClaimObject.custComplaintNo = ""
    }
     this.createNewClaimObject.custClaimTypeSelectedValue = Number( this.createNewClaimObject.custClaimTypeSelectedValue)
    this.createNewClaimObject.typeofSubmit = this.typeOfSubmit;
    this.createNewClaimObjects.push(this.createNewClaimObject);
    this.createNewClaimObjects.push(this.createNewClaimObjectCustomerDetails);
    this.createNewClaimObjects.push(this.createNewClaimObjectProductDetails);
    this.createNewClaimObjects.push(this.createNewClaimObjectClaimDetails);
    let tempObj = this.createNewClaimObject.CreatedDate;
    let CreatedDate = (tempObj)?(tempObj.toString().split('GMT'))[0]:null;
      tempObj = this.createNewClaimObject.ClosedDate;
    let ClosedDate = (tempObj)?(tempObj.toString().split('GMT'))[0]:null;
      tempObj = this.createNewClaimObjectProductDetails.custDeliveryDate;
    let custDeliveryDate =(tempObj)?(tempObj.toString().split('GMT'))[0]:null;
      tempObj = this.createNewClaimObjectClaimDetails.custDefectivePicturesOfSampleReceivedDate;
    let custDefectivePicturesOfSampleReceivedDate = (tempObj)?(tempObj.toString().split('GMT'))[0]:null;
    let dates = {
      'CreatedDate': CreatedDate,
      'ClosedDate': ClosedDate,
      'custDeliveryDate': custDeliveryDate,
      'custDefectivePicturesOfSampleReceivedDate': custDefectivePicturesOfSampleReceivedDate
    }
    this.createNewClaimObjects.push(dates);

    if (this.typeOfSubmit == 'draft') {
      this.createNewClaimObject.ClosedDate = null;
    } else {
      this.createNewClaimObject.ClosedDate = this.today;
    }
   
    let tempClaim = JSON.parse(JSON.stringify(this.createNewClaimObjects));
      tempClaim[0].typeofSubmit ='';
      tempClaim[0].ClosedDate = '';
      tempClaim[4].ClosedDate = '';
       
    if((
      JSON.stringify(this.formClone) == JSON.stringify(tempClaim) &&
      this.deleteAttachmentArray.length == 0 &&
      this.uploaderPalletTicket.queue.length == 0 &&
      this.uploaderComplianceFile.queue.length == 0 &&
      this.uploadermasterCartonBarcode.queue.length == 0 &&
      this.uploaderdefectiveSampleAttach.queue.length == 0
      )){
        var NOCHANGES = this.externalToasterService.getMessageFromCode('NOCHANGES');
       this.onSuccessToastMessage(NOCHANGES);
     this.createNewClaimObject.custComplaintNo = custComplaintNoRef;
       return;
    }

    if(this.createNewClaimObjectClaimDetails.custIssueCreditStatus){
      this.createNewClaimObjectClaimDetails.IC_ResponsibleDepartmentId = this.IC_ResponsibleDepartmentId;
      this.createNewClaimObjectClaimDetails.Replmnt_ResponsibleDepartmentId = 1; // select 1 by default
    } else if(this.createNewClaimObjectClaimDetails.custReplacementStatus){
      this.createNewClaimObjectClaimDetails.Replmnt_ResponsibleDepartmentId = this.Replmnt_ResponsibleDepartmentId; 
      this.createNewClaimObjectClaimDetails.IC_ResponsibleDepartmentId = 1; // select 1 by default
    } else {
      this.createNewClaimObjectClaimDetails.IC_ResponsibleDepartmentId = 1; // select 1 by default
      this.createNewClaimObjectClaimDetails.Replmnt_ResponsibleDepartmentId = 1; // select 1 by default
    }
    this.formClone = JSON.parse(JSON.stringify(this.createNewClaimObjects))
    this.formClone[0].typeofSubmit ='';
    this.formClone[0].ClosedDate = '';
    this.formClone[4].ClosedDate = '';

    if(this.editButtonClick == false)
    this.callCreateClaimAPI();
    else if(this.editButtonClick == true)
    this.callEditClaimAPI();
    
  }
  callCreateClaimAPI(){
    this.createnewclaimService.createNewExternalClaim(this.createNewClaimObjects, response => {
      this.apiCallStatus = false;
      
      if (response.StatusCode === "SUCCESS") {
        this.loading = false;
        this.isSubmitted = true;
        this.editableStatusBaisc = true;

        this.showDeleteIcon = false;
        if (this.formMode == 'Viewclaim') {
          this.disableClaim = true;
        }
        if (response.Data) {
          this.claimstatus = this.setClaimStatusName(response.Data.claimStatusId);
          this.createNewClaimObject.custComplaintNo = response.Data.ComplaintNumber;
          if (this.deleteAttachmentArray && this.deleteAttachmentArray.length) {
            let [promises, self] = [[], this];
            this.deleteAttachmentArray.forEach(item => {
              promises.push(self.callDeleteAttchamnet(item))
            })
            Promise.all(promises).then(() =>
              this.calluploadAllfile(response.Data.ClaimId)
            );
          } else {
            this.calluploadAllfile(response.Data.ClaimId);
          }  
        }

        if ((this.titleofView == 'Internal' ||
          this.titleofView == 'Customer' ||
          this.titleofView == 'Consumer' ||
          this.titleofView == 'Compliance') &&
          this.createNewClaimObjectClaimDetails.custSelectClaimType == 'false'
        ) {
          this.createNewClaimObject.ClosedDate = this.today;
        }

        var successMessage: String;
        successMessage = this.externalToasterService.getClaimSaveEditSuccess(response.Message, this.createNewClaimObject.custComplaintNo);

        if (this.createNewClaimObject.typeofSubmit == 'submit') {
          this.draftedItem = true;
          this.onSuccessToastMessage(successMessage);
        } else {
          this.onSuccessToastMessage(successMessage);
          this.draftedItem = false;
        }

      } else {
        this.loading = false;
        this.toastr.clearAllToasts();
        var errorMessage = this.externalToasterService.getMessageFromCode(response.Message);
        this.toastr.error(errorMessage, 'Failed', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    }, error => {
      this.loading = false;
      this.onErrorToastMessage(error);
    });
  }
  callEditClaimAPI(){
    this.createnewclaimService.editExternalClaim(this.createNewClaimObjects, response => {
      this.apiCallStatus = false;
     
      if (response.StatusCode === "SUCCESS") {
        this.editButtonClick = false;
        this.loading = false;
        this.isSubmitted = true;
        this.editableStatusBaisc = true;

        this.showDeleteIcon = false;
        if (this.formMode == 'Viewclaim') {
          this.disableClaim = true;
        }
        if (response.Data) {
          this.claimstatus = this.setClaimStatusName(response.Data.claimStatusId);
          this.createNewClaimObject.custComplaintNo = response.Data.ComplaintNumber;
          if (this.deleteAttachmentArray && this.deleteAttachmentArray.length) {
            let [promises, self] = [[], this];
            this.deleteAttachmentArray.forEach(item => {
              promises.push(self.callDeleteAttchamnet(item))
            })
            Promise.all(promises).then(() =>
              this.calluploadAllfile(response.Data.ClaimId)
            );
          } else {
            this.calluploadAllfile(response.Data.ClaimId);
          }
        }
        if ((this.titleofView == 'Internal' ||
          this.titleofView == 'Customer' ||
          this.titleofView == 'Consumer' ||
          this.titleofView == 'Compliance') &&
          this.createNewClaimObjectClaimDetails.custSelectClaimType == 'false'
        ) {
          this.createNewClaimObject.ClosedDate = this.today;
        }

        var successMessage: String;
        successMessage = this.externalToasterService.getClaimSaveEditSuccess(response.Message, this.createNewClaimObject.custComplaintNo);

        if (this.createNewClaimObject.typeofSubmit == 'submit') {
          this.draftedItem = true;
          this.onSuccessToastMessage(successMessage);
        } else {
          this.onSuccessToastMessage(successMessage);
          this.draftedItem = false;
        }
      } else {
        this.loading = false;
        this.toastr.clearAllToasts();
        var errorMessage = this.externalToasterService.getMessageFromCode(response.Message);
        this.toastr.error(errorMessage, 'Failed', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    }, error => {
      this.loading = false;
      this.onErrorToastMessage(error);
    });
  }
  complianceUploaddelete(Attachment) {
    this.modalRef.hide();
    this.complianceFileUploadDetail=[];
    const reqBody = {
    'AttachmentID': Attachment[0].AttachmentID,
    'Key': 'complainceKey'
    }
    this.deleteAttachmentArray.push(reqBody)
  }

  onDefectiveSelect(value): void {
    this.createNewClaimObjectClaimDetails.custDefectiveSampleReceivedStatus = value;
    if (value) {
      this.createNewClaimObjectClaimDetails.custDefectivePicturesOfSampleReceivedDate = null;
    }
  }

  onIssueCreditSelect(value): void {
    this.apiCallStatus = true;
    if (!value) {
      this.createNewClaimObjectClaimDetails.custPUnitCostFirst = 0;
      this.createNewClaimObjectClaimDetails.additionalCostFirst = 0;
      this.createNewClaimObjectClaimDetails.custQuantityFisrt = 0;
      this.createNewClaimObjectClaimDetails.custTotalCostFisrt = 0;
    }
    else{
      this.createNewClaimObjectClaimDetails.custReplacementStatus = false
      this.createNewClaimObjectClaimDetails.custPUnitCostSecond = 0;
      this.createNewClaimObjectClaimDetails.custQuantitySecond = 0;
      this.createNewClaimObjectClaimDetails.custTotalCostSecond = 0;

      if(this.responsibleDepartmentList && this.responsibleDepartmentList.length > 0)
      this.IC_ResponsibleDepartmentId = this.responsibleDepartmentList[0].Id;
    }
  }

  onReturnAuthorizationSelect(value): void {
    this.apiCallStatus = true;
    this.createNewClaimObjectClaimDetails.custRAno = '';
    this.createNewClaimObjectClaimDetails.custPUnitCostFirstRAno = 0;
    this.createNewClaimObjectClaimDetails.custQuantityFisrtRAno = 0;
    this.createNewClaimObjectClaimDetails.custTotalCostFisrtRAno = 0;
  }

  onReplacementSelect(value): void {
    this.apiCallStatus = true;
    if (!value) {
      this.createNewClaimObjectClaimDetails.custPUnitCostSecond = 0;
      this.createNewClaimObjectClaimDetails.custQuantitySecond = 0;
      this.createNewClaimObjectClaimDetails.custTotalCostSecond = 0;
    }else{
      this.createNewClaimObjectClaimDetails.custIssueCreditStatus = false
      this.createNewClaimObjectClaimDetails.custPUnitCostFirst = 0;
      this.createNewClaimObjectClaimDetails.additionalCostFirst = 0;
      this.createNewClaimObjectClaimDetails.custQuantityFisrt = 0;
      this.createNewClaimObjectClaimDetails.custTotalCostFisrt = 0;

      if(this.responsibleDepartmentList && this.responsibleDepartmentList.length > 0)
      this.Replmnt_ResponsibleDepartmentId = this.responsibleDepartmentList[0].Id;
    }
  }

  createOrViewResponse(){
      this.setPreviousURL();
      this.router.navigate(['Respond',this.createNewClaimObject.custComplaintNo,1], { relativeTo: this.activatedRoute.parent});
  }

  createOrViewCAPA(){

    if(this.capadisplayId==0){
        this.loading = true;
        let params = {
            ComplaintNumber:this.createNewClaimObject.custComplaintNo,
            IsCAPAValidating:false,
            SBUId:0 //no sbu
        }
        this.dashboardService.createCapa(params, response => {
            this.loading = false;
           this.setPreviousURL();
            this.router.navigate(['CAPA', response.Data], { relativeTo: this.activatedRoute.parent });

        }, error => {
            this.toastr.error('Internal Server Error', '', {
                showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
            });
        });

    } else {
      this.setPreviousURL();
      this.router.navigate(['CAPA',  this.capadisplayId], { relativeTo: this.activatedRoute.parent });
    }
  
  }

  onOtherStatusSelect(value): void {
    this.apiCallStatus = true;
    this.createNewClaimObjectClaimDetails.custOtherStatus = value;
  }

  onActionRequested() {
    if (this.disableClaim || this.createNewClaimObject.custClaimTypeSelectedValue == '3') {
    } else {
      this.clearActionRequestedFields();
    }

  }

  onNOActionRequested() {
    if (this.disableClaim || this.createNewClaimObject.custClaimTypeSelectedValue == '3') {
    } else {
      this.clearActionRequestedFields();
    }
  }
  
  valuechangeIssueCredt(e): void {
    this.apiCallStatus = true;
    const total: any = (Number(this.createNewClaimObjectClaimDetails.custPUnitCostFirst) * Number(this.createNewClaimObjectClaimDetails.custQuantityFisrt)) + Number(this.createNewClaimObjectClaimDetails.additionalCostFirst)
    if(this.custClaimTypeValue!=='Compliance'){
      this.createNewClaimObjectClaimDetails.custTotalCostFisrt = total.toFixed(4);
      }

  }

  valuechangeIssueCredtRAno(e): void {
    this.apiCallStatus = true;
    const total: any = Number(this.createNewClaimObjectClaimDetails.custPUnitCostFirstRAno) * Number(this.createNewClaimObjectClaimDetails.custQuantityFisrtRAno)
    this.createNewClaimObjectClaimDetails.custTotalCostFisrtRAno = total.toFixed(4);
  }

  valuechangeReplacement(e): void {
    this.apiCallStatus = true;
    const total: any = Number(this.createNewClaimObjectClaimDetails.custPUnitCostSecond) * Number(this.createNewClaimObjectClaimDetails.custQuantitySecond)
    this.createNewClaimObjectClaimDetails.custTotalCostSecond = total.toFixed(4);
  }
  
  onPalletTicketBrowse(): void {
  }

  onMasterBarcodeBrowse(): void {
  }

  onAttachFileBrowse(): void {
  }

  onSuccessToastMessage(msg): void {
    this.loading = false;
    this.toastr.clearAllToasts();
    var SUCCESS = this.externalToasterService.getMessageFromCode('SUCCESS');
    this.toastr.success(msg, SUCCESS, {
      showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
    });
  }

  onErrorToastMessage(error): void {
    this.loading = false;
    this.toastr.clearAllToasts();
    var SORRYMSG = this.externalToasterService.getMessageFromCode('SORRYMSG');
    var FAILURE = this.externalToasterService.getMessageFromCode('FAILURE');
    this.toastr.error(SORRYMSG, FAILURE, {
      showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
    });
  }

  isValidEmail(email): boolean {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  unitCostValidation(price): boolean {
    var regex = /^(?:\d*\.\d{1,4}|\d+)$/;
    return regex.test(price);
  } 
  
  onMajorClick(): void {
    this.clearActionRequestedFields();
  }

  onMinorClick(): void {
    this.clearActionRequestedFields();
  }

  clearActionRequestedFields(): void {
    this.apiCallStatus = true;
    this.createNewClaimObjectClaimDetails.custPUnitCostFirst = '';
    this.createNewClaimObjectClaimDetails.additionalCostFirst = '';
    this.createNewClaimObjectClaimDetails.custQuantityFisrt = '';
    this.createNewClaimObjectClaimDetails.custTotalCostFisrt = 0;
    this.createNewClaimObjectClaimDetails.custRAno = '';
    this.createNewClaimObjectClaimDetails.custPUnitCostFirstRAno = '';
    this.createNewClaimObjectClaimDetails.custQuantityFisrtRAno = '';
    this.createNewClaimObjectClaimDetails.custTotalCostFisrtRAno = 0;
    this.createNewClaimObjectClaimDetails.custPUnitCostSecond = '';
    this.createNewClaimObjectClaimDetails.custQuantitySecond = '';
    this.createNewClaimObjectClaimDetails.custTotalCostSecond = 0;
    this.createNewClaimObjectClaimDetails.custSectionOthersDescription = '';
    this.createNewClaimObjectClaimDetails.custIssueCreditStatus = false;
    this.createNewClaimObjectClaimDetails.custReturnAutorizationStatus = false;
    this.createNewClaimObjectClaimDetails.custReplacementStatus = false;
    this.createNewClaimObjectClaimDetails.custOtherStatus = false;
    this.createNewClaimObjectClaimDetails.CAPAFlag = false
    this.createNewClaimObjectClaimDetails.totalClaims = '';
    this.createNewClaimObjectClaimDetails.totalAmount = '';
  }

  complianceFilePopUpView(uploadTemplate: TemplateRef<any>, uploadViewTemplate: TemplateRef<any>): void {
    this.loading = true;
    
    this.createnewclaimService.getAttachmentsCompliance(this.createNewClaimObject.custComplaintNo, response => {
      this.loading = false;
      if (response.ResponseCode == 413 || response.ResponseCode == 414) {
        window.location.href = this.constant.loginURL;
      } else if (response.ResponseCode === 200) {
        
        if (response.Data.length) {
          if (this.cmpflag) {
            this.modalRef = this.modalService.show(uploadViewTemplate, { class: 'd-flex align-self-center modal-xl', ignoreBackdropClick: true });
          } else {
            this.modalRef = this.modalService.show(uploadTemplate, { class: 'd-flex align-self-center modal-lg', ignoreBackdropClick: true });
          }
          this.complianceTableData = response.Data;

        } else {
          this.modalRef = this.modalService.show(uploadTemplate, { class: 'd-flex align-self-center modal-lg', ignoreBackdropClick: true });
        }
      } else {
        this.toastr.error(response.ResponseMessage, 'Failed', {
          showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
        });
      }
    }, error => {

    });
  }

  invoiceSearchClick(template?: TemplateRef<any>, popupSearch?: String): void {
    this.createNewClaimObjectClaimDetails.invoiceSelection = '';
      this.loading = true;
      let params = {
        CountryId: this.createNewClaimObjectCustomerDetails.custCountry,
        SearchKey: this.createNewClaimObject.custInvoiceNo
      }
      this.createnewclaimService.getInvoiceSearchResullt(params, response => {
        this.loading = false;
        if (response.ResponseCode === 200) {
          this.searchInvoiceResults1 = (response.Data.ET_INV_DETAILS) ? response.Data.ET_INV_DETAILS : [];

          this.searchInvoiceResults = response.Data;
          if (popupSearch !== "popupSearch") // if popup is already opened, no need to open again
            this.modalRef = this.modalService.show(template, { class: 'd-flex align-self-center modal-md' });
          this.invoiceHeader = this.searchInvoiceResults;
          this.invoiceNumberHeader = (this.invoiceHeader.ES_HEADER) ? this.invoiceHeader.ES_HEADER.INVOICE : '';
          this.invoiceCustomerName = (this.invoiceHeader.ES_HEADER) ? this.invoiceHeader.ES_HEADER.NAME : '';
        } else if (response.ResponseCode === 400) {
          this.toastr.clearAllToasts();
          this.toastr.error("SAP Login Failed", 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
        } else if (response.ResponseCode === 600) {
          this.toastr.clearAllToasts();
          this.toastr.error("Unknown error occured", 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
        } else {
          this.toastr.clearAllToasts();
          this.toastr.error(response.ResponseMessage, 'Failed', {
            showCloseButton: true, maxShown: 1, toastLife: this.constant.toastTime
          });
        }
      }, error => {

      });
    
  }

  invoiceSearchPopUpViewclose(): void {
    if (this.invoicedetailspopulate !== undefined) {
      this.createNewClaimObject.currency = (this.invoiceHeader.ES_HEADER.CURRENCY) ? this.invoiceHeader.ES_HEADER.CURRENCY : '';
      this.createNewClaimObject.custInvoiceValue = (this.invoiceHeader.ES_HEADER.AMOUNT) ? this.invoiceHeader.ES_HEADER.AMOUNT : '';
      this.createNewClaimObjectCustomerDetails.custCustomerNo = (this.invoiceHeader.ES_HEADER.CUSTOMER) ? this.invoiceHeader.ES_HEADER.CUSTOMER : '';
      this.invoiceHeader.ES_HEADER.TEL_NUMBER = (this.invoiceHeader.ES_HEADER.TEL_NUMBER) ? this.invoiceHeader.ES_HEADER.TEL_NUMBER.replace(/[^a-zA-Z0-9]/g, "") : '';
      this.createNewClaimObjectCustomerDetails.custCustomerPhone = (this.invoiceHeader.ES_HEADER.TEL_NUMBER) ? this.invoiceHeader.ES_HEADER.TEL_NUMBER : '';
      this.createNewClaimObjectProductDetails.custDeliveryNo = (this.invoicedetailspopulate.DELIVERY) ? this.invoicedetailspopulate.DELIVERY : '';
      this.createNewClaimObjectCustomerDetails.custNameOfCustomer = (this.invoiceHeader.ES_HEADER.NAME) ? this.invoiceHeader.ES_HEADER.NAME : '';
      this.createNewClaimObjectProductDetails.custSKUNo = (this.invoicedetailspopulate.KDMAT) ? this.invoicedetailspopulate.KDMAT : '';
      this.createNewClaimObjectProductDetails.internalSKUNo = (this.invoicedetailspopulate.MATNR) ? this.invoicedetailspopulate.MATNR : '';
      this.invoicedetailspopulate.LGMNG = (this.invoicedetailspopulate.LGMNG) ? this.invoicedetailspopulate.LGMNG.split('.')[0] : '';
      this.createNewClaimObjectProductDetails.custNoOfDeliveredItems = (this.invoicedetailspopulate.LGMNG) ? this.invoicedetailspopulate.LGMNG : '';
      
      let invoiceDistr: any;
      let reltArry: any = [];
      invoiceDistr = (this.dropdownDistributionChannel) ? this.dropdownDistributionChannel : []
      if (this.invoiceHeader.ES_HEADER.VTWEG) {
        reltArry = invoiceDistr.filter(item => {
          return item.DistributionChannelID == this.invoiceHeader.ES_HEADER.VTWEG
        })
        if (reltArry.length) {
          this.createNewClaimObjectCustomerDetails.custDistributionChannelSelectedValue = this.invoiceHeader.ES_HEADER.VTWEG;
        } else {
          this.createNewClaimObjectCustomerDetails.custDistributionChannelSelectedValue = '0'
        }
      } else {
        this.createNewClaimObjectCustomerDetails.custDistributionChannelSelectedValue = '0';
      }

      if (this.invoicedetailspopulate.ZBRDES) {
        for (var i = 0; i < this.brandList.length; i++) {
          if (this.brandList[i].Brand.toUpperCase() === this.invoicedetailspopulate.ZBRDES) {
            this.createNewClaimObjectProductDetails.custBrandSelectedValue = this.brandList[i].BrandID;

          }
        }
      }
    }

    this.InvoiceSearchPopUpView = 'hide';
  }

  invoiceSearchSelected(invoicedetails): void {

    this.invoicedetailspopulate = invoicedetails;
    this.createNewClaimObjectProductDetails.custProductDescription = invoicedetails.MAKTX;

  }

  getDistributionChannels(sbu_id, value) {
    if (sbu_id) {
      this.dropdownDistributionChannel = [];
      this.createnewclaimService.getDistributionChannel(sbu_id, response => {
        if (response.StatusCode == "SUCCESS") {
          this.dropdownDistributionChannel = (response.Data) ? response.Data : [];
          this.createNewClaimObjectCustomerDetails.custDistributionChannelSelectedValue =
            (this.dropdownDistributionChannel.length == 1) ? this.dropdownDistributionChannel[0].DistributionChannelID : value;
        }

      }, error => {

      })
    }
  }

  onAnchorClick(_id: any, initLoaded?) {
    let headerNav: any = document.querySelector("#fixed-nav-header");
    let footerNav: any = document.querySelector(".footer-fixed");
    let scrollablePage: any = document.querySelector("#scrollable-page");
    let lastBlock: any = document.querySelector(".block.last");
    let pageHeight: any = $(window).height();
    scrollablePage.style.paddingTop = (headerNav.offsetHeight) + "px";
    let top: any = 0;
    let block: any;

    for (let i = 1; i < _id; i++) {
      block = document.querySelector("#block-" + i);
      top = top + block.offsetHeight;
    }
    this.activeTab = "block-" + _id;
    document.body.scrollTop = document.documentElement.scrollTop = top;

    /*Activate navigation when scroll the page*/
    function onScroll(event) {
      var scrollPos = document.documentElement.scrollTop + headerNav.offsetHeight + 10;
      $('#tabHeader a').each(function () {
        var currLink = $(this);
        if (currLink.attr("data-target")) {
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
    if (initLoaded) {
      let footerHeight = footerNav ? footerNav.offsetHeight : 50;
      lastBlock.style.minHeight = (pageHeight - (headerNav.offsetHeight + footerHeight) - 10) + 'px';
      document.removeEventListener('scroll', onScroll);
      document.addEventListener('scroll', onScroll);
    }
  }

  getResponsibleDeptList(): void {
    this.createnewclaimService.getResponsibleDeptList('', response => {
      let dataArray = (response.Data) ? response.Data : [];
      this.responsibleDepartmentList = (dataArray) ? dataArray : [];
      if(this.responsibleDepartmentList && this.responsibleDepartmentList.length > 0)
      this.setReponsibleDeptDefaults();
    }, error => { });
  }

  setReponsibleDeptDefaults(){ // set the field value as the first value from the array
    this.createNewClaimObjectClaimDetails.custSectionFisrtLbl = this.responsibleDepartmentList[0].Name;
    this.createNewClaimObjectClaimDetails.custSectionSecondLbl = this.responsibleDepartmentList[0].Name;

    this.IC_ResponsibleDepartmentId = this.responsibleDepartmentList[0].Id; //  the first value from the array
    this.Replmnt_ResponsibleDepartmentId = this.responsibleDepartmentList[0].Id;
  }

  setResponsibleDeptName(id) {
    var name = "";
    if (this.responsibleDepartmentList && this.responsibleDepartmentList.length > 0) {
      this.responsibleDepartmentList.forEach(element => {
        if (element.Id == id)
          name = element.Name;
      });
    }
    return name;
  }

  closeInvoiceSearchPopup(){
    this.checkNullValueInvoiceNum();
    this.modalRef.hide();
  }

  checkNullValueInvoiceNum(){
    if(!this.createNewClaimObject.custInvoiceNo){
      this.createNewClaimObject.custInvoiceValue = '';
      this.createNewClaimObject.currency = '';
    }
  }

  invoiceNumNgModValChange(){
    this.createNewClaimObject.custInvoiceValue = '';
    this.createNewClaimObject.currency = '';
  }

  setClaimStatusName(status_id) {
    var statusName = '';
    if (this.claimStatusList && this.claimStatusList.length > 0) {
      this.claimStatusList.forEach(element => {
        if (element.ClaimSatatusId == status_id)
          statusName = element.ClaimSatus;
      });
      return statusName;
    }
  }

  getClaimTypes(): void {
    this.createnewclaimService.getClaimTypes('', response => {
      if (response.StatusCode == "SUCCESS") { 
        this.dropdownSection = (response.Data) ? response.Data : []; 
        this.claimTypeList = (response.Data) ? response.Data : [];
  
        if(this.claimtypeselected){
          let self = this;
          let dropdownSectionList:any = this.dropdownSection.filter(item=>{
            return(self.claimtypeselected == item.SectionID)
          });
          if(dropdownSectionList.length == 0){
            this.toastr.error('Unauthorized access.', 'Failed!', {
              showCloseButton: true, maxShown: 1
            });
            setTimeout(()=>{
              this.router.navigate(['/login']);
            }, 2000)
            return;
          }
        }
      }
     
    }, error => { 

    });
  }

  getSBUList(): void {
    if(this.formMode =='Createnewclaim')
    this.loading = true;
    this.createnewclaimService.getSBUs('', response => {
      if (response.StatusCode == "SUCCESS") {
        this.SBUList = (response.Data) ? response.Data : [];
        this.createNewClaimObject.custSBUSelectedValue = (this.SBUList.length ==1 )?this.SBUList[0].EntityID: '0';
        this.getDistributionChannels(this.createNewClaimObject.custSBUSelectedValue,'0');
        if(this.formMode =='Createnewclaim')
        this.loading = false;
      }
     
    }, error => { 

    });
  }

  getBrandList(): void {
    this.createnewclaimService.getBrandList('', response => {
      if (response.StatusCode == "SUCCESS") {
        this.brandList = (response.Data) ? response.Data : [];
      }  
    }, error => { 

    });
  }

  getComplaintCategory(): void {
    this.createnewclaimService.getComplaintCategory('', response => {
      if (response.StatusCode == "SUCCESS") { 
        this.complaintCategoryList = (response.Data) ? response.Data : [];
      }
    }, error => { 

    });
  }

  getModeOfComplaintList(): void {
    this.createnewclaimService.getModeOfComplaintList('', response => {
      if (response.StatusCode == "SUCCESS") { 
        this.modeOfComplaintList = (response.Data) ? response.Data : [];
      }
    }, error => { 

    });
  }

  getClaimStatusList(): void {
    this.createnewclaimService.getExternalClaimStatus('', response => {
      if (response.StatusCode == "SUCCESS") { 
        this.claimStatusList = (response.Data) ? response.Data : [];
      }
    }, error => { 

    });
  }

  setBrandName(brand_id){
    var brandName = '';
    if (this.brandList && this.brandList.length > 0) {
      this.brandList.forEach(element => {
        if (element.BrandID == brand_id)
        brandName = element.Brand;
      });
      return brandName;
    }
  }
  
  setClaimType(claim_type_id){
    var claim_type = '';
    if (this.claimTypeList && this.claimTypeList.length > 0) {
      this.claimTypeList.forEach(element => {
        if (element.SectionID == claim_type_id)
        claim_type = element.Section;
      });
      return claim_type;
    }
  }
  
}
